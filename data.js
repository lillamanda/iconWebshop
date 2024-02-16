const inventoryArray = [ 
    {
        name: "Lightmode",
        image: "lightmode.png",
        includedFormats: [".png", ".jpg", ".svg"], 
        id: 0,
        price: 5, 
        orderAmount: 0, 
    },
    {
        name: "Darkmode",
        image: "darkmode.png",
        includedFormats: [".png", ".jpg", ".svg"],
        price: 5,
        id: 1, 
        orderAmount: 0, 
    },
        {
        name: "Lightmode & darkmode",
        image: "lightdarkiconscombined.png",
        includedFormats: [".png", ".jpg", ".svg"],
        price: 8,
        id: 2, 
        orderAmount: 0, 
    }
    
]

const discountCodesArr = [
    {
        code: "10OFF50", 
        discountType: "USD",
        discount: 10, 
        minimumOrderSum: 50, 
        description: "$10 off orders over $50"
    }, 
    {
        code: "10PCT", 
        discountType: "PCT",
        discount: 10, 
        minimumOrderSum: 0, 
        description: "10% off"
    }
]

const ordersArr = [
]


export { inventoryArray, discountCodesArr, ordersArr }