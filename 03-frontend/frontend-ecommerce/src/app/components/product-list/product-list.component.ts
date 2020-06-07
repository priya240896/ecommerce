import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId: number=1;
  searchMode:boolean=false;
  //new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements=0;

  previousKeyword:string=null;
  
  constructor(private productService: ProductService,
              private cartService:CartService,
             private route:ActivatedRoute) { } //obj is use to inject product service

  ngOnInit(): void { //similar to @PostConstructor
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    }
    )
    
  }
  listProducts()
  {
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode)
    {
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
  }
   handleSearchProducts()
   {
     const theKeyword=this.route.snapshot.paramMap.get('keyword');
     if(this.previousKeyword!=theKeyword)
     {
       this.thePageNumber=1;
     }
     this.previousKeyword=theKeyword;
     console.log(`keyword=${theKeyword},thepageNumber=${this.thePageNumber}`)
     this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
     
   }
   handleListProducts()
   {
     //check if the id parameter is available 
    const hasCategoryId: boolean=this.route.snapshot.paramMap.has('id');
    if(hasCategoryId)
    {
      //get the id param string. convert string to a number using + symbol
      this.currentCategoryId= +this.route.snapshot.paramMap.get('id');
    }
    else{
      //no category is available....default to category_id 1
      this.currentCategoryId=1;
    }

    //
    //check if we have difdferent category then previous
    //Note:Angular will reuse the component if it is currently being viewed

    //if we have a different category id than previous
    //the set the page no back to 1
    if(this.previousCategoryId!=this.currentCategoryId)
    {
      this.thePageNumber=1;
    }
    this.previousCategoryId=this.currentCategoryId;
    console.log(`currentCategory=${this.currentCategoryId}`,`thePageNumber=${this.thePageNumber}`);

    //get the product for given category id 
    this.productService.getProductListPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
   }
   processResult(){
     return data=>{
       this.products=data._embedded.products;
       this.thePageNumber=data.page.number+1;
       this.thePageSize=data.page.size;
       this.theTotalElements=data.page.totalElements;
                }
    }
     updatePageSize(pageSize:number)
     {
       this.thePageSize=pageSize;
       this.thePageNumber=1;
       this.listProducts();
     }
     addToCart(theProduct:Product)
     {
       console.log(`Add to cart: ${theProduct.name},${theProduct.unitPrice}`);
       const theCartItem=new CartItem(theProduct);
       this.cartService.addToCart(theCartItem)
     }
   
 }

