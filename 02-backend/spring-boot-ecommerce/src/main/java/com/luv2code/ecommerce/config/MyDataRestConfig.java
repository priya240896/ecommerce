package com.luv2code.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	
	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager)
	{
		entityManager=theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		
		HttpMethod[] theUnsupportedActions= {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};
		
		config.getExposureConfiguration()
        .forDomainType(Product.class)
        .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
        .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
		
		config.getExposureConfiguration()
		.forDomainType(ProductCategory.class)
		.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
        .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

		// call internal helper method to expose the ids
		exposeIds(config);
	}

	private void exposeIds(RepositoryRestConfiguration config) {
		// expose entity ids
		
		//get the list of all entity class  from entity manager
		Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();
		
		//create an arraylist of those entity type
		List<Class> entityClasses=new ArrayList<>();
		
		//get the entity types for those entities
		for(EntityType tempEntityType:entities)
		{
			entityClasses.add(tempEntityType.getJavaType());
		}
		
		//expose the entity id for array of entity domain type
		Class[] domainTypes= entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
		
	}
	
	
	

}
