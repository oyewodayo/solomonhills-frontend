
// Process Voucher Start here


window.addEventListener('DOMContentLoaded', ()=>{
    const firstname         = document.querySelector('#firstname'); 
    const lastname          = document.querySelector('#lastname'); 
    const email             = document.querySelector('#email');
    const wallet             = document.querySelector('#wallet');
    const amount            = document.querySelector('#amount');
    let merchant            = document.querySelector("input[name='merchant']");           
    const priority          = document.querySelector('#priority'); 
    const notify            = document.querySelector('#notify'); 
    const generate          = document.querySelector('#generate');
    const myself            = document.querySelector('#myself');
    const pay_with          = document.querySelector('#pay_with');
    const find_user         = document.getElementById('find-user'); 
    const token             = document.querySelector("input[name='_token']");

    if (amount) {
        amount.addEventListener('keyup',()=>{
            if(amount.value !=""){   
                // console.log(amount.value);
                var newamount = amount.value.replaceAll(/[-e]/g,'');
                amount.value = newamount;        
            }
    
        });
    }
  
    if (myself) {
        myself.addEventListener('change',()=>{

            if (myself.checked) {

                document.getElementById('for_myself').classList.remove('d-none')
                document.getElementById('not_for_myself').classList.add('d-none')
            }
            if (!myself.checked) {

                document.getElementById('for_myself').classList.add('d-none')
                document.getElementById('not_for_myself').classList.remove('d-none')
            }
        });
    }
  

    if (merchant) {
        merchant.addEventListener('keyup',()=>{ 
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(!merchant.value.match(mailformat)){
                find_user.innerHTML = `<div class="text-success">
                           Invalid email.                 
                       </div>`; 
            }             
            var params = { 
                _token: token,
                merchant:merchant.value,    
            };
    
            axios.post("/searchUserByEmailOrPhone", params)
            .then(function (response) {
                const req = response.data;
            // console.log(response.data);
                if(req.error == false){  
                    find_user.innerHTML = `<div class="text-success">
                        ${req.message}                  
                    </div>`;                           
                
                }

                else{
                    find_user.innerHTML = `<div class="text-danger">
                        ${req.message}
                    </div>`; 
                
                }
            })
            .catch(function (error) {
                console.log(error);
                find_user.innerHTML = `<div class="text-danger"> Something went wrong <div>`;
        
            });
            
        });
    }

  

    // Process VOUCHERS
    if (generate) {
        generate.addEventListener('click', ()=>{
            if (myself.checked) {
                merchant = document.getElementById('merchant-2');
                // console.log(merchant.value);
            }
            if (!myself.checked) {
                merchant = document.getElementById('merchant');
                // console.log(merchant.value);
            }
    
            const feedback          = document.querySelector('.pin-feedback');
            generate.innerHTML      = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Generating...`;
            let params = { 
                    _token:token.value,
                    amount:amount.value,
                    priority:priority.value,
                    merchant:merchant.value,
                    pay_with:pay_with.value,
                    notify:notify.checked
                };
    
            axios.post("/manager/voucher/payment", params)
            .then(function (response) {
                const req = response.data;
                // console.log(req.data);
            
                if(req.error == false ){ 
                    if (req.message == "processing") {
                        generate.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> ${req.data} payment...`;
                        buyVoucherWithPayStack(firstname.value,lastname.value,email.value,wallet.value,req.amount_fee,params);
                        
                    }
                    else{
                        generate.innerHTML = `Generate`;
                        document.querySelector('#voucher-form').reset();
                        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                                                ${req.message}
                                            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                                            </div>`;
                        }
               
                }
    
                else{
                    generate.innerHTML = `Generate`;
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                                            ${req.message}
                                        <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                                        </div>`;
                        
                }
                
            })
            .catch(function (error) {
                console.log(error);
                generate.innerHTML = `Generate`;
                feedback.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong class="pad-left-20"> <i class="fa fa-warning" style="font-size:20px"> </i> Something went wrong </strong></div>`;
            });
    
        });     
    }


    function buyVoucherWithPayStack(firstname,lastname,email,wallet,amount_fee,params){
        var generate             = document.querySelector('.generate');   
    
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email,
            amount: amount_fee*100,
            currency: 'NGN',
            firstname: firstname,
            lastname: lastname,
            label:'Voucher for'.email,
            // channels: ['card'],
            metadata: {
               
                    display_name: firstname+' '+lastname,
                    wallet: wallet,
                    product:'voucher'
                
            },
            callback: function(response){
                
                params.reference = response.reference;
                sendQuery(params);  
            },
            onClose: function(){
                generate.innerHTML = " Generate "; 
            }
        });
        handler.openIframe(); 
    }
         


    function sendQuery(params){  
        var generate       = document.querySelector('.generate');  
        let feedback       =  document.getElementById('pin-feedback');

        var url            = "/manager/voucher/verifyVoucher";
        generate.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Verifying payment... `;
        generate.disabled = true;
        console.log(params);
        axios.post(url, params)
        .then(function (response) {
            const req = response.data;
            if(req.error == false || req.error == 'false' ){  
                generate.innerHTML = " Generate ";  
                document.querySelector('#voucher-form').reset();
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.message}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                generate.disabled = false;                             

            }

            else{
                generate.innerHTML = " Generate "; 
                generate.disabled = false; 
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.message}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                        
            }
        })
        .catch(function(error){
            generate.innerHTML = " Generate "; 
            generate.disabled = false; 
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">${error} Something went wrong <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        });
    }
        
});