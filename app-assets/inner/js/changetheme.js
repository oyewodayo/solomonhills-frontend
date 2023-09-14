function copyToClipboard(id){
    var r = document.createRange();
    var d = document.getElementById(id);
    if (d) {
        d.classList.add('clipboardCopied');
        r.selectNode(d);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(r);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
       
        alert(' Copied ');
        d.classList.remove('clipboardCopied'); 
        // alert(d.innerHTML+' Copied');   
    }
}


window.addEventListener('DOMContentLoaded', ()=>{
    var expand_action       = document.querySelector('#expand');
    var reduce_action       = document.querySelector('#reduce');
    var transaction_table   = document.querySelector('.col-xl-8#transactions');
    var breakdown           = document.querySelector('#breakdown');
    
    var transaction_data    = document.querySelector('#transaction-data');

    if (expand_action) {
        expand_action.addEventListener('click',()=>{
            transaction_table.classList.remove('col-xl-8');
            transaction_table.classList.add('col-xl-12');
            reduce_action.classList.remove('d-none');
            reduce_action.classList.add('inline-block');
            expand_action.classList.add('d-none');
            breakdown.classList.add('d-none');
            breakdown.classList.remove('inline-block');
            transaction_data.style.height="";
        });
    }

    
    if (reduce_action) {
        reduce_action.addEventListener('click',()=>{
            transaction_table.classList.remove('col-xl-12');
            transaction_table.classList.add('col-xl-8');
            reduce_action.classList.remove('inline-block');
            reduce_action.classList.add('d-none');     
            expand_action.classList.remove('d-none');            
            expand_action.classList.add('inline-block');
            transaction_data.style.minHeight="33em"; 
    
            breakdown.classList.remove('d-none'); 
            breakdown.classList.add('inline-block');          
          
        });  
    }
      
});


(function() {
    const switch_theme = document.getElementById('customSwitch15');
    const profile_image = document.getElementById('profile_image');
    var token               = document.querySelector('input[name="_token"]');
    
    if (switch_theme) {
        switch_theme.addEventListener('change', async ()=>{
            const theme     =document.querySelector("input[name='theme']");  
    
            console.log(theme.checked);
            const params = {
                    theme:theme.checked
            };

            const response = await fetch('/profile/change-theme',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRF-TOKEN':token.value
                },
                body:JSON.stringify(params)
            })
            .then((response)=>response.json())
            .then(req =>{
                console.log(req.error);
                if(req.error == false )
                { 
                    document.body.classList.remove("dark-layout");          
                    document.querySelector("input[name='theme']").value=0; 
  
                }
                else{
                    document.body.classList.add("dark-layout");
                    document.querySelector("input[name='theme']").value=1;
                                
                }
                
            })
            .catch((error)=>{
                console.log(error)
            })
            
        });  
    }


    if (profile_image) {
        profile_image.addEventListener('click',()=>{
            window.location.href = '/profile/general';
        });   
    }

})();