

For this project, I've utilized a lot of my new knowledge. 

For the UI/CSS-side, I've made the website responsive for a range of screens, 
with scalable content and adjustments for readability and a better user experience. 
I've used media-queries, as well as other methods for making a site responsive 
(like flexbox and its properties flex-basis and flex-grow, - in addition to using 
responsive units for margins/paddings/font-sizes). 

For the Javascript/functional part, I've used a range of different methods in order 
to get the site to behave as desired. 

I've used JS modules which have been imported into the main javascript-file. I've 
kept a separate data.js-file for storing product-data to generate the product-list 
available for purchase, - as well as an array of available discount codes and an 
array for storing incoming orders. Ideally these things will be saved in a database, 
but I have not started one for this project. 

The project includes a wide range of different array-functions to manipulate, sort, 
search and retrieve the array or array-items. For instance, several ways to iterate 
over the array to get the item or items needed, - from a normal for-loop, to a 
forEach(), filter(), find(), map(). I've also made use of includes() to check if the 
product that's being added is already in the order-list where I could just change the 
order-amount, or whether the item needs to be added as a new line. I've also used 
the join() method in order to list specifications of products in a good way. 
In order to calculate the order-sum, I've used the reduce()-function to add the different 
ordered items prices and amounts together. 

In addition to the static HTML, a lot of it is rendered in JS. One method used is 
retrieving elements with getElementById() or querySelector(), and changing them 
using innerHTML, or adding/removing from classList. I've also built an entire section 
of HTML using createElement(), setAttribute() and innerText in order to prevent users 
from typing in HTML in the name-field of the form and altering the site. Using these 
methods, any user-entered HTML will not render on site like it would with innerHTML. 

I've manipulated strings and numbers with JS, using methods such as toString(), trim(), 
substr(), toUpperCase(), split(), replace(), toFixed().

The website has multiple eventlisteners, most of them are for "click"-actions, but 
there's also a mouseover to display a tooltip when the requirements for the discount 
is not yet met, - as well as a keypress-function that allows the user to press enter
in order to add the discount code, instead of using the button. The eventlistener 
basically presses the button for them when the enter-key is pressed. In multiple cases 
the eventlisteners targets datasets to identify the element correctly in order to 
proceed with the correct actions. 

When it comes to forms and buttons, I've used .reportValidity() to check if a form is valid 
before allowing it to submit and proceed in the payment process. I've disabled and enabled 
buttons using the .disabled-property. I've also reset forms using the reset()-function.

While I personally prefer writing more easy-to-read code such as proper if-statements, 
I've also used arrow functions and ternary operators in this project. I've also identified 
one case where I could've used short-circuiting with &&, but chose to do this with an 
if-statement instead.

There's also other JS-things I've learnt and implemented in this project, like 
using a switch statement instead of an if-else-statement. I've also destructured objects into 
different variables for use in functions. In addition I've created a class with functions to 
create objects (receipts) from. 

I love the outcome of this project, I think it's working pretty smoothly, it looks pretty clean, 
and it should look equally good on a range of different devices. 

Maybe at some point I will connect a payment solution to it, and make it a functional webshop.
