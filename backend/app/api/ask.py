"""
DataMind AI — /api/ask endpoint

Returns a structured AI-powered response with:
- Natural language answer
- Generated SQL
- Query results
- Chart metadata
- Insights
- Performance metadata
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.database_agent import ask_database

logger = logging.getLogger("datamind.api")

router = APIRouter()


class AskRequest(BaseModel):
    question: str


from fastapi.responses import JSONResponse

@router.post("/ask")
def ask_question(request: AskRequest):
    """
    Process a natural-language question about the database.

    Returns a structured response with AI-generated answer,
    SQL query, results, charts, and insights.
    """

    question = request.question.strip()

    if not question:
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "error": {
                    "code": "BAD_REQUEST",
                    "message": "Question cannot be empty"
                }
            }
        )

    try:
        result = ask_database(question)

        if not result.get("success"):
            error_msg = result.get("answer", "Unknown error")
            method = result.get("summary", {}).get("method", "")

            # Only use HTTP error codes for real server/auth failures.
            # "not_found" / "conversational" are valid 200 responses with a friendly message.
            if "quota" in error_msg.lower() or "rate-limited" in error_msg.lower():
                return JSONResponse(
                    status_code=429,
                    content={"success": False, "error": {"code": "AI_QUOTA_EXHAUSTED", "message": error_msg}, "sql": result.get("sql", ""), "summary": result.get("summary", {})}
                )
            elif "api key" in error_msg.lower():
                return JSONResponse(
                    status_code=401,
                    content={"success": False, "error": {"code": "AI_AUTH_ERROR", "message": error_msg}, "sql": result.get("sql", ""), "summary": result.get("summary", {})}
                )
            elif "unavailable" in error_msg.lower() and method not in ("not_found", "conversational"):
                return JSONResponse(
                    status_code=503,
                    content={"success": False, "error": {"code": "AI_UNAVAILABLE", "message": error_msg}, "sql": result.get("sql", ""), "summary": result.get("summary", {})}
                )
            else:
                # Query not found / unrecognised input — return 200 with the friendly message
                return JSONResponse(status_code=200, content=result)

        logger.info(
            f"Query processed: '{question[:50]}...' | "
            f"Method: {result['summary']['method']} | "
            f"Rows: {result['summary']['rows']} | "
            f"Time: {result['summary']['total_time_ms']}ms | "
            f"Cache: {result['summary']['from_cache']}"
        )

        return result


    except Exception as e:
        logger.error(f"Unexpected error processing question: {e}", exc_info=True)

        error_str = str(e).lower()
        error_code = "SERVER_ERROR"

        if "503" in error_str or "unavailable" in error_str or "demand" in error_str:
            user_message = "The AI service is temporarily experiencing high demand. Please try again in a few moments."
            error_code = "AI_UNAVAILABLE"
        elif "429" in error_str or "quota" in error_str or "exhausted" in error_str:
            user_message = "AI request limit reached. Please wait a moment and try again."
            error_code = "AI_QUOTA_EXHAUSTED"
        elif "api_key" in error_str or "api key" in error_str:
            user_message = "AI service configuration error. Please check the backend API key."
            error_code = "AI_AUTH_ERROR"
        elif "timeout" in error_str:
            user_message = "The request timed out. Try a simpler question."
            error_code = "TIMEOUT"
        elif "unsafe" in error_str or "only read-only" in error_str:
            user_message = "Only read-only analytical queries are allowed."
            error_code = "UNSAFE_QUERY"
        else:
            user_message = "An error occurred while processing your question. Please try again."

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": error_code,
                    "message": user_message
                }
            }
        )