// Pre-aggregated Olist e-commerce dataset
// Extracted from the standalone HTML dashboard JSON (99,441 orders)

export const DASHBOARD_DATA = {
  meta: {
    name: "Olist Brazilian E-Commerce Dataset",
    generatedFrom: "9 source CSVs, merged at order level",
    totalOrders: 99441,
  },

  dataQuality: {
    tables: [
      { name: "Customers",   rows: 99441,  cols: 5,  missing: 0,      missingPct: 0.00, duplicates: 0 },
      { name: "Orders",      rows: 99441,  cols: 8,  missing: 4908,   missingPct: 0.62, duplicates: 0 },
      { name: "Order Items", rows: 112650, cols: 7,  missing: 0,      missingPct: 0.00, duplicates: 0 },
      { name: "Payments",    rows: 103886, cols: 5,  missing: 0,      missingPct: 0.00, duplicates: 0 },
      { name: "Reviews",     rows: 99224,  cols: 7,  missing: 145903, missingPct: 21.01, duplicates: 0 },
      { name: "Products",    rows: 32951,  cols: 10, missing: 3058,   missingPct: 0.93, duplicates: 0 },
      { name: "Sellers",     rows: 3095,   cols: 4,  missing: 0,      missingPct: 0.00, duplicates: 0 },
    ],
    qualityScore: 90.3,
  },

  kpis: {
    totalOrders: 99441,
    delivered: 96478,
    canceled: 625,
    shipped: 1107,
    pending: 1231,
    totalCustomers: 96096,
    totalProducts: 32951,
    totalSellers: 3095,
    totalPaymentValue: 16008872.12,
    avgOrderValue: 160.99,
    deliveryRatePct: 97.02,
  },

  statusDist: [
    { status: "delivered",   count: 96478, pct: 97.02 },
    { status: "shipped",     count: 1107,  pct: 1.11 },
    { status: "canceled",    count: 625,   pct: 0.63 },
    { status: "unavailable", count: 609,   pct: 0.61 },
    { status: "invoiced",    count: 314,   pct: 0.32 },
    { status: "processing",  count: 301,   pct: 0.30 },
    { status: "created",     count: 5,     pct: 0.01 },
    { status: "approved",    count: 2,     pct: 0.00 },
  ],

  payment: {
    summary: {
      total: 16008872.12,
      avg: 160.99,
      max: 13664.08,
      min: 0.0,
      median: 105.29,
      totalDelivered: 15422461.77,
      avgDelivered: 159.86,
    },
    top5: [
      { order_id: "03caa2c0", value: 13664.08, order_status: "delivered", customer_state: "RJ" },
      { order_id: "736e1922", value: 7274.88,  order_status: "delivered", customer_state: "ES" },
      { order_id: "0812eb90", value: 6929.31,  order_status: "delivered", customer_state: "MS" },
      { order_id: "fefacc66", value: 6922.21,  order_status: "delivered", customer_state: "ES" },
      { order_id: "f5136e38", value: 6726.66,  order_status: "delivered", customer_state: "SP" },
    ],
    byStatus: [
      { status: "approved",    total: 241.08,       avg: 120.54, count: 2 },
      { status: "canceled",    total: 143255.60,    avg: 229.21, count: 625 },
      { status: "created",     total: 688.10,       avg: 137.62, count: 5 },
      { status: "delivered",   total: 15422461.77,  avg: 159.86, count: 96477 },
      { status: "invoiced",    total: 69137.99,     avg: 220.18, count: 314 },
      { status: "processing",  total: 69394.11,     avg: 230.55, count: 301 },
      { status: "shipped",     total: 177213.96,    avg: 160.08, count: 1107 },
      { status: "unavailable", total: 126479.51,    avg: 207.68, count: 609 },
    ],
    typeDist: [
      { type: "credit_card", count: 76795, pct: 73.92 },
      { type: "boleto",      count: 19784, pct: 19.04 },
      { type: "voucher",     count: 5775,  pct: 5.56 },
      { type: "debit_card",  count: 1529,  pct: 1.47 },
      { type: "not_defined", count: 3,     pct: 0.00 },
    ],
    byType: [
      { type: "credit_card", total: 12542084.19, avg: 163.32, max: 13664.08, min: 0.01, count: 76795 },
      { type: "boleto",      total: 2869361.27,  avg: 145.03, max: 7274.88,  min: 11.62, count: 19784 },
      { type: "voucher",     total: 379436.87,   avg: 65.70,  max: 3184.34,  min: 0.00,  count: 5775 },
      { type: "debit_card",  total: 217989.79,   avg: 142.57, max: 4445.50,  min: 13.38, count: 1529 },
      { type: "not_defined", total: 0.00,        avg: 0.00,   max: 0.00,     min: 0.00,  count: 3 },
    ],
  },

  orders: {
    mostCommonStatus: "delivered",
    top5Expensive: [
      { orderId: "03caa2c0", value: 13664.08, status: "delivered", state: "RJ" },
      { orderId: "736e1922", value: 7274.88,  status: "delivered", state: "ES" },
      { orderId: "0812eb90", value: 6929.31,  status: "delivered", state: "MS" },
      { orderId: "fefacc66", value: 6922.21,  status: "delivered", state: "ES" },
      { orderId: "f5136e38", value: 6726.66,  status: "delivered", state: "SP" },
    ],
    monthly: [
      { month: "2016-09", orders: 4,    revenue: 252.24 },
      { month: "2016-10", orders: 324,  revenue: 59090.48 },
      { month: "2016-12", orders: 1,    revenue: 19.62 },
      { month: "2017-01", orders: 800,  revenue: 138488.04 },
      { month: "2017-02", orders: 1780, revenue: 291908.01 },
      { month: "2017-03", orders: 2682, revenue: 449863.60 },
      { month: "2017-04", orders: 2404, revenue: 417788.03 },
      { month: "2017-05", orders: 3700, revenue: 592918.82 },
      { month: "2017-06", orders: 3245, revenue: 511276.38 },
      { month: "2017-07", orders: 4026, revenue: 592382.92 },
      { month: "2017-08", orders: 4331, revenue: 674396.32 },
      { month: "2017-09", orders: 4285, revenue: 727762.45 },
      { month: "2017-10", orders: 4631, revenue: 779677.88 },
      { month: "2017-11", orders: 7544, revenue: 1194882.80 },
      { month: "2017-12", orders: 5673, revenue: 878401.48 },
      { month: "2018-01", orders: 7269, revenue: 1115004.18 },
      { month: "2018-02", orders: 6728, revenue: 992463.34 },
      { month: "2018-03", orders: 7211, revenue: 1159652.12 },
      { month: "2018-04", orders: 6939, revenue: 1160785.48 },
      { month: "2018-05", orders: 6873, revenue: 1153982.15 },
      { month: "2018-06", orders: 6167, revenue: 1023880.50 },
      { month: "2018-07", orders: 6292, revenue: 1066540.75 },
      { month: "2018-08", orders: 6512, revenue: 1022425.32 },
    ],
  },

  products: {
    avgPrice: 120.65,
    top10ByRevenue: [
      { productId: "bb50f2e2", category: "health_beauty",        revenue: 63885.00 },
      { productId: "6cdd5384", category: "health_beauty",        revenue: 54730.20 },
      { productId: "d6160fb7", category: "computers",            revenue: 48899.34 },
      { productId: "d1c42706", category: "computers_accessories", revenue: 47214.51 },
      { productId: "99a4788c", category: "bed_bath_table",       revenue: 43025.56 },
      { productId: "3dd2a171", category: "computers_accessories", revenue: 41082.60 },
      { productId: "25c38557", category: "baby",                 revenue: 38907.32 },
      { productId: "5f504b3a", category: "cool_stuff",           revenue: 37733.90 },
      { productId: "53b36df6", category: "watches_gifts",        revenue: 37683.42 },
      { productId: "aca2eb7d", category: "furniture_decor",      revenue: 37608.90 },
    ],
    top10ByOrderCount: [
      { productId: "99a4788c", category: "bed_bath_table",        orders: 467 },
      { productId: "aca2eb7d", category: "furniture_decor",       orders: 431 },
      { productId: "422879e1", category: "garden_tools",          orders: 352 },
      { productId: "d1c42706", category: "computers_accessories", orders: 323 },
      { productId: "389d119b", category: "garden_tools",          orders: 311 },
      { productId: "53b36df6", category: "watches_gifts",         orders: 306 },
      { productId: "368c6c73", category: "garden_tools",          orders: 291 },
      { productId: "53759a2e", category: "garden_tools",          orders: 287 },
      { productId: "154e7e31", category: "health_beauty",         orders: 269 },
      { productId: "2b4609f8", category: "health_beauty",         orders: 259 },
    ],
    bottom10ByRevenue: [
      { productId: "46fce52c", category: "health_beauty",                    revenue: 2.20 },
      { productId: "310dc320", category: "stationery",                       revenue: 2.29 },
      { productId: "8a3254be", category: "construction_tools_construction",  revenue: 2.55 },
      { productId: "680cc853", category: "pet_shop",                         revenue: 2.90 },
      { productId: "2e8316b3", category: "stationery",                       revenue: 2.99 },
      { productId: "5304ff3f", category: "art",                              revenue: 3.50 },
      { productId: "0eeeb45e", category: "music",                            revenue: 3.85 },
      { productId: "836c4b48", category: "fashion_underwear_beach",          revenue: 3.90 },
      { productId: "c2fb2674", category: "computers_accessories",            revenue: 3.90 },
      { productId: "dc9f66a5", category: "unknown",                          revenue: 3.90 },
    ],
    topCategoriesByRevenue: [
      { category: "health_beauty",        revenue: 1258681.34, count: 9670,  avgPrice: 130.16 },
      { category: "watches_gifts",        revenue: 1205005.68, count: 5991,  avgPrice: 201.14 },
      { category: "bed_bath_table",       revenue: 1036988.68, count: 11115, avgPrice: 93.30 },
      { category: "sports_leisure",       revenue: 988048.97,  count: 8641,  avgPrice: 114.34 },
      { category: "computers_accessories",revenue: 911954.32,  count: 7827,  avgPrice: 116.51 },
      { category: "furniture_decor",      revenue: 729762.49,  count: 8334,  avgPrice: 87.56 },
      { category: "cool_stuff",           revenue: 635290.85,  count: 3796,  avgPrice: 167.36 },
      { category: "housewares",           revenue: 632248.66,  count: 6964,  avgPrice: 90.79 },
      { category: "auto",                 revenue: 592720.11,  count: 4235,  avgPrice: 139.96 },
      { category: "garden_tools",         revenue: 485256.46,  count: 4347,  avgPrice: 111.63 },
      { category: "toys",                 revenue: 483946.60,  count: 4117,  avgPrice: 117.55 },
      { category: "baby",                 revenue: 411764.89,  count: 3065,  avgPrice: 134.34 },
      { category: "perfumery",            revenue: 399124.87,  count: 3419,  avgPrice: 116.74 },
      { category: "telephony",            revenue: 323667.53,  count: 4545,  avgPrice: 71.21 },
      { category: "office_furniture",     revenue: 273960.70,  count: 1691,  avgPrice: 162.01 },
    ],
  },

  customers: {
    avgSpendPerCustomer: 166.59,
    top10ByOrders: [
      { customerId: "8d50f5ea", orders: 17, spent: 927.63,  state: "SP" },
      { customerId: "3e43e610", orders: 9,  spent: 1172.66, state: "SP" },
      { customerId: "1b6c7548", orders: 7,  spent: 959.01,  state: "MG" },
      { customerId: "6469f99c", orders: 7,  spent: 758.83,  state: "SP" },
      { customerId: "ca77025e", orders: 7,  spent: 1122.72, state: "PE" },
      { customerId: "12f5d6e1", orders: 6,  spent: 110.72,  state: "PR" },
      { customerId: "47c1a303", orders: 6,  spent: 944.21,  state: "SP" },
      { customerId: "63cfc61c", orders: 6,  spent: 826.32,  state: "RJ" },
      { customerId: "dc813062", orders: 6,  spent: 1094.63, state: "PE" },
      { customerId: "de34b161", orders: 6,  spent: 660.94,  state: "SP" },
    ],
    top10BySpend: [
      { customerId: "0a0a9211", orders: 1, spent: 13664.08, state: "RJ" },
      { customerId: "46450c74", orders: 3, spent: 9553.02,  state: "SC" },
      { customerId: "da122df9", orders: 2, spent: 7571.63,  state: "RJ" },
      { customerId: "763c8b1c", orders: 1, spent: 7274.88,  state: "ES" },
      { customerId: "dc4802a7", orders: 1, spent: 6929.31,  state: "MS" },
      { customerId: "459bef48", orders: 1, spent: 6922.21,  state: "ES" },
      { customerId: "ff4159b9", orders: 1, spent: 6726.66,  state: "SP" },
      { customerId: "4007669d", orders: 1, spent: 6081.54,  state: "MG" },
      { customerId: "5d0a2980", orders: 1, spent: 4809.44,  state: "GO" },
      { customerId: "eebb5dda", orders: 1, spent: 4764.34,  state: "SP" },
    ],
    stateDist: [
      { state: "SP", orders: 41746, revenue: 5998226.96 },
      { state: "RJ", orders: 12852, revenue: 2144379.69 },
      { state: "MG", orders: 11635, revenue: 1872257.26 },
      { state: "RS", orders: 5466,  revenue: 890898.54 },
      { state: "PR", orders: 5045,  revenue: 811156.38 },
      { state: "SC", orders: 3637,  revenue: 623086.43 },
      { state: "BA", orders: 3380,  revenue: 616645.82 },
      { state: "DF", orders: 2140,  revenue: 355141.08 },
      { state: "ES", orders: 2033,  revenue: 325967.55 },
      { state: "GO", orders: 2020,  revenue: 350092.31 },
      { state: "PE", orders: 1652,  revenue: 324850.44 },
      { state: "CE", orders: 1336,  revenue: 279464.03 },
      { state: "PA", orders: 975,   revenue: 218295.85 },
      { state: "MT", orders: 907,   revenue: 187029.29 },
      { state: "MA", orders: 747,   revenue: 152523.02 },
      { state: "MS", orders: 715,   revenue: 137534.84 },
      { state: "PB", orders: 536,   revenue: 141545.72 },
      { state: "PI", orders: 495,   revenue: 108523.97 },
      { state: "RN", orders: 485,   revenue: 102718.13 },
      { state: "AL", orders: 413,   revenue: 96962.06 },
      { state: "SE", orders: 350,   revenue: 75246.25 },
      { state: "TO", orders: 280,   revenue: 61485.33 },
      { state: "RO", orders: 253,   revenue: 60866.20 },
      { state: "AM", orders: 148,   revenue: 27966.93 },
      { state: "AC", orders: 81,    revenue: 19680.62 },
      { state: "AP", orders: 68,    revenue: 16262.80 },
      { state: "RR", orders: 46,    revenue: 10064.62 },
    ],
  },

  delivery: {
    avgDeliveryDays: 12.09,
    onTimePct: 91.88,
  },

  reviews: {
    avgScore: 4.09,
    distribution: [
      { score: 1, count: 11424 },
      { score: 2, count: 3151 },
      { score: 3, count: 8179 },
      { score: 4, count: 19142 },
      { score: 5, count: 57328 },
    ],
  },

  eda: {
    price: {
      count: 112650, mean: 120.65, median: 74.99, min: 0.85, max: 6735.00,
      std: 183.63, q1: 39.90, q3: 134.90, outliers: 8427,
    },
    freight: {
      count: 98666, mean: 22.82, median: 17.17, min: 0.00, max: 1794.96,
      std: 21.65, q1: 13.85, q3: 24.04, outliers: 9941,
    },
    paymentValue: {
      count: 103886, mean: 154.10, median: 100.00, min: 0.00, max: 13664.08,
      std: 217.49, q1: 56.79, q3: 171.84, outliers: 7981,
    },
    reviewScore: {
      count: 99224, mean: 4.09, median: 5.00, min: 1.00, max: 5.00,
      std: 1.35, q1: 4.00, q3: 5.00, outliers: 14575,
    },
    deliveryDays: {
      count: 96470, mean: 12.09, median: 10.00, min: 0.00, max: 209.00,
      std: 9.55, q1: 6.00, q3: 15.00, outliers: 5022,
    },
  },

  insights: [
    "Delivery success rate is 97.0% — 96,478 of 99,441 orders delivered.",
    "Delivered orders contributed R$ 15,422,461.77 in total payment value.",
    "'health_beauty' is the top revenue-generating category at R$ 1,258,681.34.",
    "SP leads by order volume with 41,746 orders (42% of total).",
    "Average delivery time is 12.1 days, with 91.9% on or before the estimated date.",
    "Average review score is 4.09 / 5.0 across 99,224 rated orders.",
    "Credit card dominates payments at 73.9% (76,795 transactions).",
    "Top 5 customers by spend account for R$ 44,242.59 (0.28% of total revenue).",
  ],
};

// Helper types
export type StatusDistItem = typeof DASHBOARD_DATA.statusDist[number];
export type MonthlyItem = typeof DASHBOARD_DATA.orders.monthly[number];
export type PaymentTypeItem = typeof DASHBOARD_DATA.payment.typeDist[number];
export type CategoryItem = typeof DASHBOARD_DATA.products.topCategoriesByRevenue[number];
export type StateItem = typeof DASHBOARD_DATA.customers.stateDist[number];

// Formatters
export const fmtCurrency = (v: number, inr = false) =>
  inr
    ? "₹" + (v * 22.5).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "R$" + v.toLocaleString("en-US", { maximumFractionDigits: 2 });

export const fmtNum = (v: number) => v.toLocaleString("en-US");

export const fmtPct = (v: number) => v.toFixed(1) + "%";

export const STATUS_COLORS: Record<string, string> = {
  delivered:   "#3ECF8E",
  shipped:     "#5B8DEF",
  canceled:    "#E5646A",
  unavailable: "#8B94A3",
  invoiced:    "#F2B84B",
  processing:  "#B08BF0",
  created:     "#4FD1C5",
  approved:    "#4FD1C5",
};

export const PAYMENT_COLORS = ["#F2B84B", "#5B8DEF", "#3ECF8E", "#B08BF0", "#8B94A3"];

export const CATEGORY_COLORS = [
  "#F2B84B","#3ECF8E","#5B8DEF","#B08BF0","#E5646A",
  "#4FD1C5","#F97316","#84CC16","#EC4899","#6366F1",
  "#14B8A6","#F59E0B","#8B5CF6","#10B981","#EF4444",
];

export const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
