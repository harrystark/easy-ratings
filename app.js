
var scraper = require('google-search-scraper');
var google = require('google')
 
function getSeqlinks(book_string){
    
    google.resultsPerPage = 10

    seq_links = []

    return new Promise(
        function (resolve, reject) {
                        
            google(book_string, function (err, res){
                
                if (err){ 
                    console.error(err)
                    reject(err)
                }
                else{
                for (var i = 0; i < res.links.length; ++i) {
                    var link = res.links[i];
                    seq_links.push(link.href)
                }
                // console.log(seq_links)
                    resolve(seq_links)
                }

            })
            
        }
    );

  }
 




function getMetadata(book_string){
    
    var review_data  = []
    links_remaining = 10;
    
    var options = {
      query: book_string,
      limit: 10
    };
    return new Promise(
        function (resolve, reject) {
                        

            scraper.search(options, function(err, url, meta) {
                // This is called for each result
                if(err){
                    reject(err)
                }
                else{
                ret_data = {meta:meta.meta , url:url, title:meta.title, desc:meta.desc}
                review_data.push(ret_data);
                links_remaining--;
                if(links_remaining <=0 ){
                    // console.log(review_data)
                    resolve(review_data)
                }
              //   console.log(url);
              //   console.log(meta.title);
              //   console.log(meta.meta);
              //   console.log(meta.desc)
                }
              });
            
        }
    );
}




function getReview(name, reviewer="goodreads"){
    
    return new Promise(function(resolve, reject){
        search_query = name + " "+ reviewer+" review"
        getSeqlinks(search_query).then((seq_data)=>{
            getMetadata(search_query).then((meta_data) =>{
                for(let seq_d of seq_data){
                    for(let meta_d of meta_data){
                        if(meta_d.meta != ''){
                        if (seq_d == meta_d.url){
                            resolve(meta_d)
                        }
                    }
                    }
                }
                reject(new Error("Nothing Found"))
    
            })
    
        });

    })
    
}

//getReview("fightclud").then((data)=>{console.log(data)})

module.exports.getRating = getReview
