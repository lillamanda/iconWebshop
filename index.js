import { inventoryArray, discountCodesArr, ordersArr } from "/data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const discountCodeInputEl = document.getElementById("discount-code-input");
const discountFeedbackMsgEl = document.getElementById("discount-feedback-msg");

const ratingStars = document.getElementsByClassName("rating-stars"); 

const orderEl = document.getElementById("order-el");
const totalSumEl = document.getElementById("total-sum-el");
const discountEl = document.getElementById("discount-el");

renderProductList();

let order = [];

let addedDiscountCode;

let orderSum = 0;  
let discountSum = 0;
let totalSumAfterDiscount = 0;

let ratingGiven = false;


/* Classes */

class OrderReceipt{
    constructor(currentOrderList, currentOrderSum, currentDiscountSum, customerName, creditcard){

        // Note: I know a uuid isn't needed in this case, and that it should not be manipulated in this way. 
        // Also, order numerations would ideally be sequential, but I wanted to practice using UUID, 
        // - and the manipulation of the string was just added bonus practice :)
        this.uuid = uuidv4().replace(/\D/g, "").substring(0,5);

        this.orderedItems = currentOrderList; 
        this.receiptOrderSum = currentOrderSum;
        this.receiptDiscount = currentDiscountSum; 
        this.receiptSumAfterDiscount = this.receiptOrderSum - this.receiptDiscount; 

        this.customerName = customerName.trim();
        this.creditcardBlanked = `**** **** **** ${creditcard.trim().substr(-4, 4)}`;
    }

    // Since this function uses user input (Name for the order), I built it with elements and innerText to avoid HTML code being passed in with innerHTML
    getReceiptHtmlElement() {

        const receiptHtmlElement = document.createElement("div");
        receiptHtmlElement.setAttribute("class", "receipt"); 


        const receiptTitle = document.createElement("h1");
        receiptTitle.innerText = "Order receipt"; 
        receiptHtmlElement.appendChild(receiptTitle);


        const orderIdP = document.createElement("p");
        orderIdP.setAttribute("class", "order-id");
        orderIdP.innerText = `Order ID: ${this.uuid}`;
        receiptHtmlElement.appendChild(orderIdP);


        this.orderedItems.forEach(function(item){
            const { orderAmount, name, price } = item; 
            
            const itemizedLine = document.createElement("p"); 
            itemizedLine.setAttribute("class", "itemized-line"); 
            itemizedLine.innerText = `${orderAmount} ${name}`;

            const priceSpan = document.createElement("span");
            priceSpan.setAttribute("class", "margin-left-auto");
            priceSpan.innerText = `$${(price*orderAmount).toFixed(2)}`; 

            itemizedLine.appendChild(priceSpan);
            receiptHtmlElement.appendChild(itemizedLine);
        })


        receiptHtmlElement.appendChild(document.createElement("hr"))


        if(this.receiptDiscount){
            const discountLineP = document.createElement("p"); 
            discountLineP.setAttribute("class", "itemized-line"); 
            discountLineP.innerText = `Discount `

            const discountSumSpan = document.createElement("span");
            discountSumSpan.setAttribute("class", "margin-left-auto"); 
            discountSumSpan.innerText = `- $${this.receiptDiscount.toFixed(2)}`

            discountLineP.appendChild(discountSumSpan);
            receiptHtmlElement.appendChild(discountLineP);

            receiptHtmlElement.appendChild(document.createElement("hr"))
        }


        const totalSumLineP = document.createElement("p"); 
        totalSumLineP.setAttribute("class", "itemized-line bold"); 
        totalSumLineP.innerText = `Total sum `

        const totalSumSpan = document.createElement("span");
        totalSumSpan.setAttribute("class", "margin-left-auto"); 
        totalSumSpan.innerText = `$${this.receiptSumAfterDiscount.toFixed(2)}`

        totalSumLineP.appendChild(totalSumSpan);
        receiptHtmlElement.appendChild(totalSumLineP);


        receiptHtmlElement.appendChild(document.createElement("br"))


        const customerP = document.createElement("p"); 
        customerP.innerText = "Customer:";
        customerP.appendChild(document.createElement("br"));
        
        const customerNameSpan = document.createElement("span"); 
        customerNameSpan.innerText = this.customerName; 
        
        customerP.appendChild(customerNameSpan);
        receiptHtmlElement.appendChild(customerP);


        const creditcardP = document.createElement("p"); 
        creditcardP.innerText = "Paid with creditcard: ";
        creditcardP.appendChild(document.createElement("br"));
        
        const creditCardSpan = document.createElement("span"); 
        creditCardSpan.innerText = this.creditcardBlanked; 
        
        creditcardP.appendChild(creditCardSpan);
        receiptHtmlElement.appendChild(creditcardP);
        

        return receiptHtmlElement;
    }

}


/* Event listeners */

document.getElementById("discount-el").addEventListener("mouseover", function(e){

    if(e.target.id === "discount-line" || e.target.parentElement.id === "discount-line"){
        if (addedDiscountCode.minimumOrderSum > orderSum){
            document.querySelector(".tooltiptext").style.visibility = "visible"
            setTimeout(() => {
                document.querySelector(".tooltiptext").style.visibility = "hidden"
            }, "2500")
        }   
    }

})

document.addEventListener("click", function(e){

    if(e.target.dataset.order){
        const currentItem = inventoryArray.find(function(product){
            return product.id.toString() === e.target.dataset.order;
        })
        
        addToCart(currentItem)
    }

    else if (e.target.id === "order-btn" && order.length){
        toggleDisplay("payment-modal", true);
    }

    else if (e.target.dataset.remove){

        switch(e.target.dataset.remove) {

            case "discount" :
                addedDiscountCode = null;
                renderOrderSection();
                break;

            default :
                removeItem(e.target.dataset.remove)

        }
    }

    else if (e.target.dataset.close){
        toggleDisplay(e.target.dataset.close, false)
    }

    else if (e.target.id === "pay-btn"){
        e.preventDefault();

        if(document.getElementById("payment-form").reportValidity()){
            
            toggleDisplay("payment-modal", false);

            processOrder();

        }
    }

    else if (e.target.id === "add-discount-btn"){
        validateAndSetDiscountCode(discountCodeInputEl.value)
    }

    else if (e.target.dataset.star){    
        if(!ratingGiven){
            renderStarsGiven(e.target.dataset.star);
            ratingGiven = true;
            toggleDisplay("feedback-to-user-after-rating", true)
        }
        else{
            toggleDisplay("double-voting-error-message", true)
            setTimeout(() => {
                toggleDisplay("double-voting-error-message", false);
            }, "2500");
        }
    }

})

discountCodeInputEl.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        document.getElementById("add-discount-btn").click();
    }
});


/* Render productlist */

function renderProductList(){
    document.getElementById("product-list").innerHTML = getProductListHtml();
}

function getProductListHtml(){

    const productListHtml = inventoryArray.map(function(product){
        const {image, name, includedFormats, price, id} = product;

        return `                
        <div class="itemized-line product">
            <img class="item-img" alt="picture of ${name}" src="img/${image}">
            <div class="item-info">
                <h1>${name}</h1>
                <p class="faded-text">Included formats: ${includedFormats.join(", ")}</p>
                <p class="price">$${price}</p>
            </div>
            <img src="img/addbtn.png" alt="button to add item" class="margin-left-auto add-item-btn" data-order="${id}">
        </div>` 
    }).join("")

    return productListHtml;

}


/* Add or remove items/discounts to order */

function addToCart(item){
    item.orderAmount += 1;

    if(!order.includes(item)){
        order.push(item)
    }

    renderOrderSection();
}

function removeItem(itemId){
    const orderItem = order.filter(item => item.id.toString() === itemId)[0];

    orderItem.orderAmount -= 1; 

    if(!orderItem.orderAmount){
        const filteredOrder = order.filter(item => item !== orderItem)
        order = filteredOrder;
    }

    renderOrderSection()
}

function validateAndSetDiscountCode(inputCode){    

    const filteredDiscountCodeArr = discountCodesArr.filter(function(discountCode){
        return discountCode.code === inputCode.trim().toUpperCase();
    })
    
    resetDiscountFeedback();

    let discountFeedbackMsg = "";

    if(filteredDiscountCodeArr.length){
        addedDiscountCode = filteredDiscountCodeArr[0];
        discountFeedbackMsg = `"${inputCode}" has been added to your order`
        renderOrderSection("discountcode added");
    }
    else{ 
        discountCodeInputEl.classList.add("input-error")
        discountFeedbackMsgEl.classList.add("error-msg")
        discountFeedbackMsg = `Sorry, "${inputCode}" is not a valid discount code`
    }

    discountFeedbackMsgEl.textContent = discountFeedbackMsg;

}


/* Calculations */

function calculateOrderSum(){
    orderSum = order.reduce(function(total, currentItem){
        const currentItemTotalSum = currentItem.price * currentItem.orderAmount;
        return total + currentItemTotalSum;
    }, 0)
    
    addedDiscountCode ? calculateDiscount() : discountSum = 0;
    
    totalSumAfterDiscount = orderSum - discountSum;

}

function calculateDiscount(){
    if(orderSum >= addedDiscountCode.minimumOrderSum && addedDiscountCode.discountType === "USD"){
        discountSum = addedDiscountCode.discount;
    }
    else if (orderSum >= addedDiscountCode.minimumOrderSum && addedDiscountCode.discountType === "PCT") {
        discountSum = orderSum*addedDiscountCode.discount/100;
    }
    else if (orderSum<addedDiscountCode.minimumOrderSum){
        discountSum = 0;
    }
}


/* General functions */

function toggleDisplay(elementID, willDisplay){
    if(willDisplay){
        document.getElementById(elementID).classList.remove("display-none");
    }
    else if (!willDisplay){
        document.getElementById(elementID).classList.add("display-none");
    }
}


/* Rendering Order */

function renderOrderSection(discountAdded = false){ 

    if(!discountAdded){
        resetDiscountFeedback();
    }

    calculateOrderSum(); 

    document.getElementById("order-btn").disabled = order.length > 0 ? false : true;
    
    if (order.length === 0){
        clearOrderSection()
    }
    else{
        toggleDisplay("discount-code-el", true);
        renderOrderedItems()
        renderDiscount();
        renderTotalSum();
    }
}

function renderOrderedItems(){ 

    const orderHtml = order.map(function(item){
        const {name, price, id, orderAmount} = item; 
        
        return `                    
        <div class="itemized-line ordered-item">
            <span class="ordered-item-amount">${orderAmount}x</span> 
            <span class="slight-indent">${name}</span>
            <span class="slight-indent remove-item" data-remove="${id}">remove</span>
            <span class="margin-left-auto">$${(price*orderAmount).toFixed(2)}</span>
        </div>
        ` 

    }).join("");

    orderEl.innerHTML = `
        <div class="order-list" id="order">
            ${orderHtml}
        </div>`

}

function renderDiscount(){

    let discountHtml = "";

    if (addedDiscountCode){

        const discountPromptSum = addedDiscountCode.minimumOrderSum > orderSum ? addedDiscountCode.minimumOrderSum - orderSum : 0;
        const discountPrompt = discountPromptSum ? `Order for $${discountPromptSum} more to qualify for the discount`: "";
        
        discountHtml = `
        <div class="tooltip itemized-line discount-line" id="discount-line">
            Discount:   
            <span class="tooltip slight-indent">${addedDiscountCode.description}</span>
            <span class="tooltip slight-indent remove-item" data-remove="discount">remove</span>
            <span class="tooltip margin-left-auto">- $${discountSum.toFixed(2)}</span> 
            <span class="tooltiptext">${discountPrompt}</span>   
        </div>`            

    }

    discountEl.innerHTML = discountHtml;
    
}

function renderTotalSum(){

    totalSumEl.innerHTML = `   
    <div class="itemized-line total-sum">
        Total price: <span class="margin-left-auto">$${totalSumAfterDiscount.toFixed(2)}</span>
    </div>`

}

function processOrder(){

    const customerName = document.querySelector("#name").value;
    const creditcardNumber = document.querySelector("#card-number").value;

    const orderReceipt = new OrderReceipt(order, orderSum, discountSum, customerName, creditcardNumber);

    ordersArr.push(orderReceipt);

    renderOrderConfirmationModal(orderReceipt);

    resetOrder();
    renderOrderSection();
}

function renderOrderConfirmationModal(receipt){
    resetStarRating();

    toggleDisplay("order-confirmation-modal", true);

    const customerFirstName = receipt.customerName.split(" ");
    document.getElementById("thank-you-customer").innerHTML = `<h1 class="bold">Thank you, ${customerFirstName[0]}!</h1>`

    const orderInformationEl = document.getElementById("order-information-el"); 
    orderInformationEl.innerHTML = "";
    document.getElementById("order-information-el").appendChild(receipt.getReceiptHtmlElement());
}

function renderStarsGiven(numberOfStarsClicked){
    for (let i = 0; i < numberOfStarsClicked; i++){
        ratingStars[i].classList.remove("fa-regular");
        ratingStars[i].classList.add("fa-solid")
    }
}


/* Reset and clear */

function resetOrder(){
    inventoryArray.forEach(function(product) {
        product.orderAmount = 0;
    })

    order = [];
    addedDiscountCode = null;
    document.querySelector("#payment-form").reset(); 

}

function clearOrderSection(){
    orderEl.innerHTML = "";
    totalSumEl.innerHTML = "";
    discountEl.innerHTML = "";
    toggleDisplay("discount-code-el", false)
}

function resetDiscountFeedback(){
    discountFeedbackMsgEl.textContent = ""
    discountFeedbackMsgEl.classList.remove("error-msg")
    discountCodeInputEl.classList.remove("input-error")
    discountCodeInputEl.value="";
}

function resetStarRating(){
    ratingGiven = false;

    for (let i = 0; i < ratingStars.length; i++){
        ratingStars[i].classList.add("fa-regular");
        ratingStars[i].classList.remove("fa-solid")
    }

    toggleDisplay("feedback-to-user-after-rating", false); 
}

