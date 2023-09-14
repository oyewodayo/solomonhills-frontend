
    window.addEventListener('DOMContentLoaded', ()=>{
        const paymentMethod     = document.querySelector('.paymentMethod');
        const remember_div      = document.querySelector('#remember_div'); 
        const amount            = document.getElementById('investment_amount'); 
        var response            = document.getElementById('response'); 

        amount.addEventListener('keyup',()=>{
            if(amount.value !=""){   
                newamount = amount.value.replaceAll(/[-e]/g,'');
                amount.value = newamount;        
            }               
        });

        //Toggle remember Card in payment method
        paymentMethod.addEventListener('change',()=>{
            switch(paymentMethod.value){

            case "new":
                remember_div.style.display = "block";
                break;
            case "old":
            case "transfer":
            case "divi":
                remember_div.style.display = "none";
                break;
            case "":
                remember_div.style.display = "none";
                break;
            }
        });  
    });



    var create_btn              = document.querySelector('.create_btn'); 
    create_btn.addEventListener('click', createInvestment);

    function createInvestment(){           
        var user_id                 = document.querySelector('.account_user_id');             
        const firstname             = document.querySelector('.account_firstname'); 
        const lastname              = document.querySelector('.account_lastname');
        const email                 = document.querySelector('.account_email'); 
        const phone                 = document.querySelector('.account_phone'); 
        const wallet                = document.querySelector('.account_wallet'); 
        const amount                = document.querySelector('.investment_amount');                
        const paymentMethod         = document.querySelector('.paymentMethod'); 
        const currency              = document.querySelector('.currency');                        
        const payment_vendor        = document.querySelector('.payment_vendor');                           
        const remember              = document.querySelector('#remember'); 



        create_btn.innerHTML = `Processing...`;
        create_btn.disabled = true;
        var _token                      = document.querySelector('input[name="_token"]'); 
        var response = document.getElementById('response'); 
        var feedback = document.getElementById('feedback');  

        var params = { 
            _token: _token.value,
            user_id:user_id.value,
            amount: amount.value, 
            payment_method:paymentMethod.value,
        };    

        axios.post("/hills/createInvestment", params)
        .then(function (response) {
            const req = response.data;
            // console.log(req);
            if(req.error == false || req.error == "false" ){ 
              
                if(req.data=="Processing"){
                    create_btn.innerHTML = `Processing...`;
                    
                    investWithCard(payment_vendor.value,currency.value,firstname.value,lastname.value,email.value,phone.value,wallet.value,user_id.value,amount.value,remember.checked)
                    //processInvestment(payment_vendor,currency,user_id,firstname,lastname,email,phone,wallet,amount,paymentMethod,remember);                      
                }
                else{
                    create_btn.innerHTML = "Add now";
                    create_btn.disabled = false;
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                        ${req.data}
                    <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                    </div>`;                          
                    setTimeout(function() {
                        window.location.reload();
                        // window.history.replaceState('','Invest', '/dashboard');
                    }, 1000);
                }

            }
            else{
                create_btn.innerHTML = `Add now`;   
                create_btn.disabled = false;                                
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`; 
                setTimeout(() => {
                    feedback.innerHTML = " ";
                }, 5000);
            }
        })
        .catch(function (error) {
            // console.log(error);
            create_btn.innerHTML = `Add now`; 
            create_btn.disabled = false; 
            response.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>Something went wrong </strong></div>`;
        });
    }

    function processInvestment(payment_vendor,currency,user_id,firstname,lastname,email,phone,wallet,amount,paymentMethod,remember){

        switch(paymentMethod.value) {
            case "new":    
                investWithCard(payment_vendor.value,currency.value,firstname.value,lastname.value,email.value,phone.value,wallet.value,user_id.value,amount.value,remember.value);
                break;
            case "divi":  
                investWithWallet(user_id.value,amount.value);
                break;

            default:              
                investWithCard(payment_vendor.value,currency.value,firstname.value,lastname.value,email.value,phone.value,wallet.value,user_id.value,amount.value,remember.value);
                break;
        }
    }


    function investWithCard(payment_vendor,currency,firstname,lastname,email,phone,wallet,user_id,amount,remember) {

        switch(payment_vendor){
            case "flutterwave":
                payWithFlutterWave(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember);
                break;
            case "paystack":
                payWithPayStack(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember);
                break;
            case "seerbit":
                payWithSeerBit(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember);
                break;
            default:
                payWithPayStack(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember);
                break;

        }
    }

    function payWithFlutterWave(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember) {
        FlutterwaveCheckout({
            public_key: "FLWPUBK_TEST-5863b694bee35fdb3d671f81d7a611c4-X",
            tx_ref: "RX1",
            amount: amount,
            currency: currency,
            payment_options: " ",

            meta: {
                consumer_id: wallet,
            },
            customer: {
                email: email,
                name: firstname+' '+lastname,
            },
            callback: function (data) {

                queryPassed(amount,currency,payment_vendor,remember,data.transaction_id);  

                // console.log(data);
            },
            onclose: function() {
                
            },
            customizations: {
                title: "Fund wallet "+wallet,
                description: "Funding wallet",
                logo: "https://solomonhills.com/img/solomon png favicon.png",
            },
        });
    }

    function payWithPayStack(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember){
        var add_fund               = document.querySelector('.create_btn');
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email,
            amount: amount*100,
            currency: currency,
            firstname: firstname,
            lastname: lastname,            
            channels: ['card'],
            metadata: {
                
                    name: firstname+' '+lastname,
                    wallet: wallet,
                    product:'hills'						
                
            },
            callback: function(response){
                queryPassed(amount,currency,payment_vendor,remember,response.reference);
            },
            onClose: function(){
                add_fund.innerHTML = "Add now";
                add_fund.disabled = false;
            }
        });
        handler.openIframe();   
    }



    function payWithSeerBit(amount,currency,payment_vendor,email,firstname,lastname,phone,wallet,remember) {
        SeerbitPay({
        "tranref": new Date().getTime(),
        "currency": "NGN",
        "description": "Hills Investment",
        "country": "NG",
        "amount": amount,
        "full_name": firstname+' '+lastname, //optional
        "email": email, //optional
        "vendorId": "attach yor sub-account ID", //optional
        "callbackurl": "/hills/invest",
        "public_key":"SBTESTPUBK_w7VCS8O7enDniidpSvfbET8x2g6GsIVw", //replace this with your own public key
        "setAmountByCustomer": false  //optional (set true to allow customer set the amount on the checkout) 
        }, 
        function callback(response) {
            // queryPassed(amount,response.reference);
            // console.log(response) /*response of transaction*/
        }, 
        function close(close) {
            // create_btn.innerHTML = ` Invest now `;
        // console.log(close) /*transaction close*/
        });
    }


    function queryPassed(amount,currency,payment_vendor,remember,reference){
        var feedback               = document.querySelector('.feedback');
        var add_fund               = document.querySelector('.create_btn');

        var _token                      = document.querySelector('input[name="_token"]'); 


        switch(payment_vendor){

            case "paystack":
            url = "/hills/paystackCardPayment";
            break;
            case "seerbit":
                url = "/hills/paystackCardPayment";
                break;
            default:
                url = "/hills/paystackCardPayment";
                break;
        }      
        var params = { 
            _token: _token,
            amount: amount,
            currency:currency,
            remember:remember,
            reference:reference,          
        };


        axios.post(url, params)
        .then(function (response) {
            const req = response.data;
        
            if(req.error == false){ 
                    add_fund.innerHTML = "Add now";
                    add_fund.disabled = false;
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                        ${req.data}
                    <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                    </div>`;                         
                    setTimeout(function() {
                        window.location.reload();
                        // window.history.replaceState('','Invest', '/dashboard');
                    }, 1000);
                }

                else{
                    add_fund.innerHTML = "Add now";
                    add_fund.disabled = false;
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                        ${req.data}
                    <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                    </div>`;
            
                    setTimeout(() => {
                            feedback.innerHTML = " ";
                        }, 5000);
                    }
        })
        .catch(function (error) {
            // console.log(error);
            add_fund.disabled = false;
            response.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong> Something went wrong </strong></div>`;
            setTimeout(() => {
                    feedback.innerHTML = " ";
                }, 5000);
        });

    }


    function setQuery(user_id,amount,reference){
        var _token              = document.querySelector('input[name="_token"]');   
        var create_btn          = document.querySelector('.create_btn'); 
        var response            = document.getElementById('response'); 

        var params = { 
            _token: _token,
            user_id:user_id,
            amount: amount,
            transactionRef:reference      
        };

        axios.post("/hills/cardPaymentProcess", params)
        .then(function (response) {
            const req = response.data;
        
            if(req.error == false){  
                response.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                    ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;                           
                setTimeout(function() {
                window.location.href="/dashboard";
                }, 1000);
            }

            else{
                response.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                    ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`; 
            }
        })
        .catch(function (error) {
            // console.log(error);
            response.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong class="pad-left-20"> <i class="fa fa-warning" style="font-size:20px"> </i> Something went wrong </strong></div>`;
            setTimeout(() => {
                    feedback.innerHTML = " ";
                }, 5000);
        });
    }



    function dateDiff(withdrawal_date,period){
        var currentdate = new Date(); 
        var end         = new Date(withdrawal_date);

        var timeDiff = end.getTime() - currentdate.getTime();

        const milliSecInDays    = 24*60*60*1000;
        const milliSecInWeeks   = 24*7*60*60*1000;
        const milliSecInMonths  = 24*31*60*60*1000;

        switch (period) {
            case 'monthly':
            var numPeriods         = timeDiff/milliSecInMonths;
                break;
            case 'weekly':
            var numPeriods         = timeDiff/milliSecInWeeks;
                break;
            case 'daily':
            var numPeriods         = timeDiff/milliSecInDays;
                break;
            default:
            var numPeriods         = timeDiff/milliSecInMonths;
                break;
        }

        return numPeriods;
    }


    //Generate a UUID
    function UUID(){
        const dataString = Date.now().toString(16);
        const randomString = Math.random().toString(16).substr(2);

        return dataString+randomString;
    }
