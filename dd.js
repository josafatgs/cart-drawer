const recommendationsContainerOne = document.getElementById('dinamically-1');
const recommendationsContainerTwo = document.getElementById('dinamically-2');

recommendationsContainerOne.innerHTML = "";
recommendationsContainerTwo.innerHTML = "";

if (data.item_count > 0){
    const products = data.items;
    let AllRecomendations = [];
    
    
    products.forEach( (product) => {
        getProductRecommendations(product.product_id)
        .then( (relatedProducts) => {
            const recommendation = relatedProducts.products;
            
            recommendation.forEach( (item) => {
                if (item.variants[0].available) {
                    AllRecomendations.push(item);
                }
            });

            const middle = AllRecomendations.length;

            for (let i = 0; i < middle; i++) {

                const product = AllRecomendations[i];

                let id = 0;
                let title = "";
                let price = 0;
                let url = "";
                let image = "";

                id = product.variants[0].id;
                title = product.title;
                price = product.price / 100;
                url = product.url;
                image = product.featured_image;

                recommendationsContainerOne.innerHTML += recommendedProduct(
                    id,
                    image,
                    url,
                    title,
                    price
                );
            }

            for (let i = middle; i < AllRecomendations.length; i++) {
                
                const product = AllRecomendations[i];

                let id = 0;
                let title = "";
                let price = 0;
                let url = "";
                let image = "";

                id = product.variants[0].id;
                title = product.title;
                price = product.price / 100;
                url = product.url;
                image = product.featured_image;

                recommendationsContainerTwo.innerHTML += recommendedProduct(
                    id,
                    image,
                    url,
                    title,
                    price
                );
            }

            updateListenersRecommended();
        })
        .catch( (error) => {
            console.error(error);
        });
    });

} else if(data.item_count == 0) {
    
    getProductRecommendations(4609298104395)
    .then( (relatedProducts) => {
        const recommendation = relatedProducts.products;
        
        recommendation.forEach( (item) => {
            if (item.variants[0].available) {
                AllRecomendations.push(item);
            }
        });

        const middle = AllRecomendations.length;

        for (let i = 0; i < middle; i++) {

            const product = AllRecomendations[i];

            let id = 0;
            let title = "";
            let price = 0;
            let url = "";
            let image = "";

            id = product.variants[0].id;
            title = product.title;
            price = product.price / 100;
            url = product.url;
            image = product.featured_image;

            recommendationsContainerOne.innerHTML += recommendedProduct(
                id,
                image,
                url,
                title,
                price
            );
        }

        for (let i = middle; i < AllRecomendations.length; i++) {
            
            const product = AllRecomendations[i];

            let id = 0;
            let title = "";
            let price = 0;
            let url = "";
            let image = "";

            id = product.variants[0].id;
            title = product.title;
            price = product.price / 100;
            url = product.url;
            image = product.featured_image;

            recommendationsContainerTwo.innerHTML += recommendedProduct(
                id,
                image,
                url,
                title,
                price
            );
        }

        updateListenersRecommended();
    })
    .catch((error) => {
        console.error(error);
    });

}