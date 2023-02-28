const Order = require('../models/orderSchema');
const fs = require('fs');
const path = require('path');
// const json2xls = require('json2xls');
const Pdfmake = require('pdfmake');
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const getFilteredSales = async (max, min) => {
  const filter = { updatedAt: { $gt: min, $lt: max } };
  const report = await Order.findOne({
    status: 'delivered',
    filter,
  });

  if (!report) return false;
  return report;
};

async function structureData(data) {
  let newArray = [];
  data.forEach((sale) => {
    let productst = [];
    let product = {
      _id: sale._id,
      billingAddress: sale.billingAddress,
      actuallAmount: sale.actuallAmount,
      paymentMethod: sale.paymentMethod,
      coupon: sale.coupon,
      deliveryDate: sale.deliveryDate.toLocaleString(),
    };
    sale.products.forEach(product => {
      productst.push(product.name)
    })
    product.products = productst;
    newArray.push(product);
  });
  
  return newArray;
}

// DOWNLOAD SALES REPORT
const downloadXls = async (req, res) => {
  let data = await structureData(req.totalSales);

  const filename = `salesReport-${Date.now()}.csv`;
  // let xls = json2xls(data);
  const createCsv = createCsvWriter({
    path : filename,
    header: [
      {id: '_id', title: 'Sale ID'},
      {id: 'billingAddress', title: 'Billing Address'},
      {id: 'actuallAmount', title: 'Amount'},
      {id: 'paymentMethod', title: 'Payment Method'},
      {id: 'coupon', title: 'Coupon'},
      {id: 'deliveryDate', title: 'Delivery Date'},
      {id: 'products', title: 'Products'}
    ]
  });
  
  await createCsv.writeRecords(data)
  // fs.writeFileSync(filename, xls, 'binary');

  res.download(filename, (err)=>{
    if(!err){
      fs.unlink(filename,(err)=>{
      });
    }
  });
  
};
// DOWNLOAD SALES REPORT
const downloadPdf = async (req, res) => {
  try {
    let data = await structureData(req.totalSales);
    let stingData = JSON.stringify(data);
    var fonts = {
      Roboto: {
        normal: path.join(__dirname, '../public/fonts/Roboto/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../public/fonts/Roboto/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '../public/fonts/Roboto/Roboto-Italic.ttf'),
      }
    }
    let createPdf = new  Pdfmake(fonts)
    let doc = {
      content: [
        stingData
      ],
    };

    const filename = `salesReport-${Date.now()}.pdf`;

    let pdf = createPdf.createPdfKitDocument(doc, {});
    pdf.pipe(fs.createWriteStream(filename));
    pdf.end();
    
      setTimeout(() =>{
        // Send the PDF file to the client for download
      res.download(filename, function(err) {
        if (err) {
          // Handle error if any
          console.log(err);
        }
        // Delete the PDF file after download
        fs.unlink(filename, function(err) {
          if (err) {
            // Handle error if any
            console.log(err);
          }
        });
      });
      },1000)
    
    
  }catch(e){
    req.flash('err', e.message)
    res.redirect('back')
  }
}
module.exports = {
  downloadPdf,
  downloadXls,
};
