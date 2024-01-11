const orderModel = require("../../model/orderModel")
const productModel = require("../../model/productModel")
const userModel = require("../../model/userModel")
const exceljs = require('exceljs');
const fs = require('fs');

//.............................loadSalesReport......................................
const loadSalesReport = async (req, res) => {
    try {
        const aggregationResult = await orderModel.aggregate([
            {
                $match: {
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'populatedProducts'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'populatedUser'
                }
            },
            {
                $project: {
                    date: 1,
                    orderStatus: 1,
                    paymentStatus: 1,
                    populatedProducts: 1,
                    'products.quantity': 1, 
                    'products.price': 1, 
                    populatedUser: 1,
                    orderNumber:1
                }
            },
            {
                $sort: {
                    date: -1
                }
            }
        ]).exec();
        req.session.orderFilterData = aggregationResult;
        req.session.save();
   
        res.render("admin/salesReport", { orderData: aggregationResult })
    } catch (error) {
        console.error(error.message + " loadSalesReport")
    }
}

//..................................fillterSalesReport..............................
const fillterSalesReport = async (req, res) => {
    try {
        const { dateFrom, dateTo } = req.body;

        const fromDate = new Date(dateFrom);
        let toDate = new Date(dateTo);
        req.session.FillterSalesData = {
            dateFrom: dateFrom,
            dateTo: dateTo
        }
        req.session.save()

        const currentDate = new Date();
        const currentDateMidnight = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            0, 0, 0, 0
        );

       

        const toDateFormat = `${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}`;
        const currentDateFormat = `${currentDateMidnight.getFullYear()}-${currentDateMidnight.getMonth() + 1}-${currentDateMidnight.getDate()}`;

        if (toDateFormat === currentDateFormat) {
            // If toDate represents the current date, set it to the end of the next day
            toDate.setDate(toDate.getDate() + 1); // Move to the next day
            toDate.setHours(23, 59, 59, 999); // Set to 23:59:59.999
        }



        const aggregationResult = await orderModel.aggregate([
            {
                $match: {
                    date: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'populatedProducts'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'populatedUser'
                }
            },
            {
                $project: {
                    date: 1,
                    orderStatus: 1,
                    paymentStatus: 1,
                    populatedProducts: 1,
                    'products.quantity': 1, 
                    populatedUser: 1,
                    orderNumber:1
                }
            },
            {
                $sort: {
                    date: -1 
                }
            }
        ]).exec();

        req.session.orderFilterData = aggregationResult;
        req.session.save();
        res.json({ data: aggregationResult })


    } catch (error) {
        console.error(error.message + " fillterSalesReport")
    }
}

//....................................reportExcelDownload.............................
const reportExcelDownload = async (req, res) => {
    try {
        const orderFilterData = req.session.orderFilterData
        const dateFrom = req.session.FillterSalesData.dateFrom
        const dateTo = req.session.FillterSalesData.dateTo
        if (!dateFrom && !dateTo) {
            min = Math.ceil(10);
            max = Math.floor(20);
            dateFrom = Math.floor(Math.random() * (max - min + 1)) + min;
            dateFrom = Math.floor(Math.random() * (max - min + 3)) + min;
        }
        const date = Date.now()
        let grandTotal = 0
        orderFilterData.forEach(element => {
            grandTotal += element.totalAmount
        });

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');
        worksheet.columns = [
            { header: 'No', key: 'no', width: 10 },
            { header: 'Product Name', key: 'productName', width: 25 },
            { header: 'Order Id', key: 'OrderId', width: 25 },
            { header: 'User Name', key: 'userName', width: 30 },
            { header: 'Order Date', key: 'OrderDate', width: 25 },
            { header: 'Quantity', key: 'quantity', width: 10 },
            { header: 'Payment Status', key: 'paymentStatus', width: 25 },
            { header: 'Order Status', key: 'orderStatus', width: 25 },
            { header: 'Price', key: 'price', width: 10 },
        ];
        let totalSalesAmount = 0;
        let counter = 0;
        orderFilterData.forEach(data => {
           
            data.populatedProducts.forEach(product => {
           
                let orderIdString = String(data._id);
                let lastFourDigits = orderIdString.slice(-4);
                let orderDate = new Date(data.date);
                let options = { year: 'numeric', month: 'long', day: 'numeric' };
                let formattedDate = orderDate.toLocaleDateString('en-US', options);
                worksheet.addRow({
                    no: ++counter,
                    productName: product.productName,
                    OrderId: data.orderNumber,
                    userName: data.populatedUser[0].firstName,
                    OrderDate: formattedDate,
                    quantity: data.products[0].quantity,
                    paymentStatus: data.paymentStatus,
                    orderStatus: data.orderStatus,
                    price: product.price * data.products[0].quantity,
                });

                totalSalesAmount += product.price * data.products[0].quantity !== undefined ? product.price * data.products[0].quantity : 0;
            });
        });

        worksheet.addRow({ orderStatus: 'Total Sales Amount', price: totalSalesAmount.toFixed(2) });

        const excelFilePath = `/salesReport/excel/sales-report-${dateFrom}-${dateTo}-${date}.xlsx`;

        // Write the Excel file
        await workbook.xlsx.writeFile(excelFilePath);
        req.session.excelFilePath = excelFilePath
        req.session.save()

        res.json({ status: true });
    } catch (error) {
        console.error(error.message + " reportExcel");
        res.status(500).send('Internal Server Error');
    }
};

//...........................download...........................
const download = async (req, res) => {
    try {
        const excelFilePath = req.session.excelFilePath
        res.download(excelFilePath, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Download failed');
            } else {
                // File downloaded successfully, now unlink or delete the file
                fs.unlink(excelFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('File unlink error:', unlinkErr);
                        // Handle error if unlinking fails
                    } else {
                        console.error('File deleted successfully');
                        // Additional logic or response if needed
                    }
                });
            }
        });
    } catch (error) {
        console.error(error.message + " download")
    }
}
module.exports = {
    loadSalesReport,
    fillterSalesReport,
    reportExcelDownload,
    download
}