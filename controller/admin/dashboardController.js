const orderModel = require("../../model/orderModel")
const userModel = require("../../model/userModel")
const loadDashboard = async (req, res) => {
    try {
        //................................................//
        //...................totalSales...................//
        //................................................//
        const today = new Date();
        const oneDayAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // Calculate 7 days ago
        const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        //............totalSalesToday..........................
        const salesTodayAggregate = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: oneDayAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
        ]);
        const salesToday = salesTodayAggregate.length > 0 ? salesTodayAggregate[0].totalSales : 0;


        //.............totalSalesWeekly.......................

        const salesAggregateLast7Days = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: sevenDaysAgo, // Start date (7 days ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            { $group: { _id: null, totalSalesLast7Days: { $sum: "$totalAmount" } } }
        ]);
        const salesWeekly = salesAggregateLast7Days.length > 0 ? salesAggregateLast7Days[0].totalSalesLast7Days : 0;

        //.............. one month ago from today........................
        const salesAggregateLastMonth = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: oneMonthAgo, // Start date (one month ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            { $group: { _id: null, totalSalesLastMonth: { $sum: "$totalAmount" } } }
        ]);

        const salesMonthly = salesAggregateLastMonth.length > 0 ? salesAggregateLastMonth[0].totalSalesLastMonth : 0;


        //......................one year ago from today.................................
        const salesAggregateLastYear = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: oneYearAgo, // Start date (one year ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            { $group: { _id: null, totalSalesLastYear: { $sum: "$totalAmount" } } }
        ]);

        const salesYearly = salesAggregateLastYear.length > 0 ? salesAggregateLastYear[0].totalSalesLastYear : 0;

        //................................................//
        //...................orderCount...................//
        //................................................//
        //..................orderCountToday........................
        const orderTodayAggregate = await orderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneDayAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const ordersToday = orderTodayAggregate.length > 0 ? orderTodayAggregate[0].totalOrders : 0;

        //.....................ordersWeekly..................................
        const ordersAggregateLast7Days = await orderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: sevenDaysAgo, // Start date (7 days ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const ordersWeekly = ordersAggregateLast7Days.length > 0 ? ordersAggregateLast7Days[0].totalOrders : 0;

        //.....................ordersMonthly..................................
        const ordersAggregateLastMonth = await orderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneMonthAgo, // Start date (one month ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const ordersMonthly = ordersAggregateLastMonth.length > 0 ? ordersAggregateLastMonth[0].totalOrders : 0;

        //.....................ordersYearly..................................
        const ordersAggregateLastYearly = await orderModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneYearAgo, // Start date (one month ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const ordersYearly = ordersAggregateLastYearly.length > 0 ? ordersAggregateLastYearly[0].totalOrders : 0;

        //.....................................///
        //...............customerCOunt...........//
        //.......................................//

        //..................customerCountToday........................
        const customerTodayAggregate = await userModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneDayAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const customersToday = customerTodayAggregate.length > 0 ? customerTodayAggregate[0].totalCustomers : 0;

        //..................customerCountWeekly........................
        const customerWeeklyAggregate = await userModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: sevenDaysAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const customersWeekly = customerWeeklyAggregate.length > 0 ? customerWeeklyAggregate[0].totalCustomers : 0;

        //..................customerCountMonthly........................
        const customerMonthlyAggregate = await userModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneMonthAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const customersMonthly = customerMonthlyAggregate.length > 0 ? customerMonthlyAggregate[0].totalCustomers : 0;

        //..................customerCountMonthly........................
        const customerYearlyAggregate = await userModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: oneYearAgo, // Start of today
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // Start of next day (tomorrow)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCustomers: { $sum: 1 } // Counting the number of documents
                }
            }
        ]);
        const customersYearly = customerYearlyAggregate.length > 0 ? customerYearlyAggregate[0].totalCustomers : 0;

        //...............................................................
        //..................salesLastFIveYearsAgoAggregate...............
        //...............................................................
        const fiveYearsAgo = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
        const salesLastFIveYearsAgoAggregate = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: fiveYearsAgo, // Start date (five years ago)
                        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // End of today
                    }
                }
            },
            {
                $group: {
                    _id: { $year: "$date" }, // Grouping by year
                    totalSales: { $sum: "$totalAmount" } // Calculate total sales for each year
                }
            },
            {
                $sort: { "_id": 1 } // Sort by year
            }
        ]);
        const years = [2019, 2020, 2021, 2022, 2023];
        const salesLastFiveYears = Array(years.length).fill(0);

        salesLastFIveYearsAgoAggregate.forEach(item => {
            const index = years.indexOf(item._id);
            if (index !== -1) {
                salesLastFiveYears[index] = item.totalSales;
            }
        });
        //...............................................................
        //..................salesMonthlyAgoAggregate...............
        //...............................................................
        const selectedYear = 2023; // Year for which data is needed

        // Define the start and end date for the selected year (January 1st to December 31st)
        const startDate = new Date(selectedYear, 0, 1); // January 1st of the selected year
        const endDate = new Date(selectedYear, 11, 31, 23, 59, 59); // December 31st of the selected year

        const salesForSelectedYearAggregate = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" }
                    },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        // Prepare an array to hold monthly sales for the selected year
        // Define an array to hold monthly sales for the selected year (2023)
        const chartSalesMonthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        // Loop through each item in the sales aggregation result
        salesForSelectedYearAggregate.forEach(item => {
            const month = item._id.month; // Retrieve the month value from the aggregation result
            const totalSales = item.totalSales; // Retrieve the total sales value for the month

            // As months are 1-based (January is 1, February is 2, etc.), adjust the index
            const monthIndex = month - 1; // Subtract 1 to get the correct 0-based index for the array

            // Update the monthlySalesForSelectedYear array at the corresponding month index
            chartSalesMonthly[monthIndex] = totalSales;
        });

        //...............................................................
        //..................salesTodayAgoAggregate.......................
        //...............................................................
        const currentDate = new Date(); // Get the current date and time

        // Set the start date to the beginning of the current day (midnight)
        const startDateToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);

        // Set the end date to the end of the current day
        const endDateToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

        const salesForTodayHourlyAggregate = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: startDateToday,
                        $lte: endDateToday
                    }
                }
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: "$date" }
                    },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { "_id.hour": 1 }
            }
        ]);

        // Prepare an array to hold hourly sales for the current day
        const chartSalesHourly = Array.from({ length: 24 }, () => 0); // Initialize an array with 24 elements, each set to 0

        // Loop through each item in the sales aggregation result
        salesForTodayHourlyAggregate.forEach(item => {
            const hour = item._id.hour; // Retrieve the hour value from the aggregation result
            const totalSales = item.totalSales; // Retrieve the total sales value for the hour

            // Update the chartSalesHourly array at the corresponding hour index
            chartSalesHourly[hour] = totalSales;
        });

        //...............................................................
        //..................salesTodayAgoAggregate.......................
        //...............................................................

        // Calculate the start date 7 days ago from the current date
        const startDate7DaysAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);

        // Aggregate sales data for the last 7 days
        const salesForLast7Days = await orderModel.aggregate([
            {
                $match: {
                    orderStatus: "delivered",
                    date: {
                        $gte: startDate7DaysAgo,
                        $lte: currentDate
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const dateOptions = { weekday: 'long' };
        const dayNamesWeekly = [];
        const chartSalesWeekly = [];

        // Loop through the last 7 days to populate sales data and day names
        for (let i = 6; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() - i);
            const dayName = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
            const formattedDate = date.toISOString().split('T')[0];

            dayNamesWeekly.push(dayName);

            // Check if sales data exists for the date; if yes, add it to chartSalesWeekly, otherwise add 0
            const matchingDaySales = salesForLast7Days.find(item => item._id === formattedDate);
            chartSalesWeekly.push(matchingDaySales ? matchingDaySales.totalSales : 0);
        }

        res.render("admin/dashboard", {
            salesToday, salesWeekly, salesMonthly, salesYearly,
            ordersToday, ordersWeekly, ordersMonthly, ordersYearly,
            customersToday, customersWeekly, customersMonthly, customersYearly,
            salesLastFiveYears, chartSalesMonthly, chartSalesHourly, dayNamesWeekly, chartSalesWeekly
        })
    } catch (error) {
        console.error(error.message + " loadDashboard")
    }
}

module.exports = {
    loadDashboard,
}