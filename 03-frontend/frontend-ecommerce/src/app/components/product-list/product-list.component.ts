import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[];
  currentCategoryId:number;
  searchMode:boolean;
  constructor(private productService: ProductService, private route:ActivatedRoute) { } //obj is use to inject product service

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
     this.productService.searchProducts(theKeyword).subscribe(
       data=>{
        console.log('search Products=' + JSON.stringify(data));
         this.products=data;
       }
     );
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
    //get the product for given category id 
    this.productService.getProductList(this.currentCategoryId).subscribe( //method is invoked once you subscribe
      data =>{
        this.products=data; //assign result to product array
      }
    );
   }
}
