import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItem:CartItem[]=[];
  //Subject is a subclass of observable which is used to publish event in our code.
  //The event will be sent to all the subscriber
  totalPrice: Subject<number>=new Subject<number>();
  totalQuantity: Subject<number>=new Subject<number>();
  constructor() { }
  addToCart(theCartItem:CartItem)
  {
    //check if we already have an item in cart
    let alreadyExistInCart:boolean=false;
    let existingCartItem:CartItem=undefined;
    if(this.cartItem.length>0)
    {
    //find the item in a cart based on cart id

    for(let tempCartItem of this.cartItem)
    {
      if(tempCartItem.id===theCartItem.id){
        existingCartItem=tempCartItem;
        break;
      }
    }
    // existingCartItem=this.cartItem.find(tempCartItem=>tempCartItem===theCartItem);
    //check if we found it 
    alreadyExistInCart=(existingCartItem!=undefined);
    }
    if(alreadyExistInCart){
      //increment the quantity
      existingCartItem.quantity++;
    }
    else{
      //just add the item to the array
      this.cartItem.push(theCartItem);  
    }
    //compute cart total price and total quantity
    this.computeCartTotals();
    
  }
  computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;
    for(let currentCartItem of this.cartItem)
    {
      totalPriceValue+=currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue+=currentCartItem.quantity;
    }
    //publish the new value...all subscriber will recieve new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    //log cart data just for debugging purpose
    this.logCartData(totalPriceValue,totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItem)
    {
      const subTotalPrice=tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name=${tempCartItem.name},quantity=${tempCartItem.quantity},
      Price=${tempCartItem.unitPrice},SubTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice:${totalPriceValue.toFixed(2)},totalQuantity:${totalQuantityValue}`);
    console.log('............');
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity==0)
    {
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get index of item in array
    const itemIndex=this.cartItem.findIndex(tempCartItem => tempCartItem.id===theCartItem.id)
    //if found remove the item from array to the given index
    if(itemIndex>-1)
    {
      this.cartItem.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }
}
