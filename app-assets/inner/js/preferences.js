
    const temi              = new Temi();
    const report            = document.getElementById('report');
    const report_period     = document.getElementById('report_period');
    const announcement      = document.getElementById('announcement');
    const product_update    = document.getElementById('product_update');
    const blog_digest       = document.getElementById('blog_digest');
    var token          = document.querySelector('input[name="_token"]').value;
    
    announcement.addEventListener('change', ()=>{
        const response = document.getElementById('response');

        const params = {
                token:token,
                announcement:announcement.checked
        };

        temi.postRequest('/profile/announcement', params).then(data=>{
                
            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${data.message}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
             
            setTimeout(()=>{
                window.location.reload();
            },2000);
       
        }).catch(error=>{
       
            response.innerHTML =`<div class="alert alert-danger mb-2 mt-2 alert-dismissible">
                Something went wrong.
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
            console.log(error);
        })
    });

    product_update.addEventListener('change', ()=>{
        const response = document.getElementById('response');
        const params = {
                token:token,
                product_update:product_update.checked
        };

        temi.postRequest('/profile/product-update', params).then(data=>{

            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${data.message}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
            setTimeout(()=>{
                window.location.reload();
            },2000);
       
        }).catch(error=>{
       
            response.innerHTML =`<div class="alert alert-danger mb-2 mt-2 alert-dismissible">
                Something went wrong.
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
        
            console.log(error);
        })
    });


    blog_digest.addEventListener('change', ()=>{
        const response = document.getElementById('response');

        const params = {
                token:token,
                blog_digest:blog_digest.checked
        };

        temi.postRequest('/profile/blog-digest', params).then(data=>{

            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${data.message}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
            setTimeout(()=>{
                window.location.reload();
            },2000);
       
        }).catch(error=>{
       
            response.innerHTML =`<div class="alert alert-danger mb-2 mt-2 alert-dismissible">
                Something went wrong.
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
        
            console.log(error);
        })
    });


    report.addEventListener('change', ()=>{
        const response = document.getElementById('response');

        const params = {
                token:token,
                report:report.checked
        };

        temi.postRequest('/profile/send-report', params).then(data=>{

            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${data.message}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
            setTimeout(()=>{
                window.location.reload();
            },2000);
       
        }).catch(error=>{
       
            response.innerHTML =`<div class="alert alert-danger mb-2 mt-2 alert-dismissible">
                Something went wrong
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
        
            console.log(error);
        })
    });

    report_period.addEventListener('change', ()=>{
        const response = document.getElementById('response');
        
        const params = {
                token:token,
                report_period:report_period.value
        };
        temi.postRequest('/profile/change-report-period', params).then(data=>{

            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${data.message}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
            setTimeout(()=>{
                window.location.reload();
            },4000);
       
        }).catch(error=>{
       
            response.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                Something went wrong.
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;
        
            console.log(error);
        })
    });      


