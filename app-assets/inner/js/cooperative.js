
    window.addEventListener('DOMContentLoaded', ()=>{
        const paymentMethod     = document.querySelector('.subscription_paymentMethod');
        const amount            = document.getElementById('subscription_amount'); 
        let dob                 = document.querySelector('.date-of-birth'); 
        const firstname              = document.querySelector('.subscription_firstname');
        const lastname              = document.querySelector('.subscription_lastname');
        const email                 = document.querySelector('.subscription_email');  
        const wallet                = document.querySelector('.subscription_wallet');                         
        const payment_vendor        = document.querySelector('.payment_vendor'); 
        const subscribe_me          = document.getElementById('subscribe'); 
        const remember_div          = document.querySelector('#remember_div'); 
        const remember              = document.querySelector('#remember'); 
        var _token                   = document.querySelector('input[name="_token"]'); 

        //Remove the filter values in [] form the amount input
        if (amount) {
            amount.addEventListener('keyup',()=>{
                if(amount.value !=""){   
                    var newamount = amount.value.replaceAll(/[-e]/g,'');
                    amount.value = newamount;        
                }               
            }); 
        }

        
       
        if (paymentMethod) {            
            paymentMethod.addEventListener('change',()=>{
            
                switch(paymentMethod.value){
                   
                    case "new":
                        // console.log(paymentMethod.value);
                        remember_div.style.display = "block";
                        break;
                    case "old": 
                        // console.log(paymentMethod.value); 
                        remember_div.style.display = "none";
                    case "divi":
                        // console.log(paymentMethod.value);
                        remember_div.style.display = "none";
                        break;
                    case "":
                        // console.log(paymentMethod.value);
                        remember_div.style.display = "none";
                        break;
                }
            });  
        }
        
        //Start: Subscribe to cooperative plan
        if (subscribe_me) {
            subscribe_me.addEventListener('click',()=>{
                subscribe_me.disabled = true
                if(amount.value == ""){
                    amount.style.borderColor = "red";
                    toastr.error('Add your subscription amount e.g 10,000', 'Divi - Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    subscribe_me.disabled = false
                    setTimeout(() => {
                 
                        amount.style.borderColor = "";
                    }, 5000);
                    return;
                }
                if(paymentMethod.value ==""){
                    paymentMethod.style.borderColor = "red";
                    toastr.error('Select payment method. ', 'Divi - Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    subscribe_me.disabled = false
                        
                    setTimeout(() => {
          
                        paymentMethod.style.borderColor = "#DFE3E7";
                    }, 5000);
                    return 
                }
                switch (paymentMethod.value) {
                    case 'new':                        
                        subscribe_me.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`;
                        createSubscription();                     
                        break;
                    case 'old':                       
                        subscribe_me.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`;
                        createSubscription();                     
                        break;
                    case 'divi':                       
                        subscribe_me.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`;
                        createSubscription();                     
                        break;
                    default:
                        paymentMethod.style.borderColor = "red";
                        toastr.error('Select payment method', 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                      
                        break;
                }
            });
        }

        async function createSubscription(){  

            subscribe_me.innerHTML      = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`;
            if (!dob) {
                dob = null;
            }else{
                dob =dob.value;
            }
            var _params = { 
                _token: _token.value,
                dob:dob,
                amount: amount.value, 
                payment_method:paymentMethod.value
            };  

      
            await fetch('/brooks/processPayment', {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                credentials:"same-origin",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN':_token.value,
                },
                body: JSON.stringify(_params)
            })
            .then((response)=>response.json())
            .then(response=>{                        
                if(response.error == false || response.error == "false" ){ 
                    // console.log(response);
                    if(response.message=="Processing"){
                        subscribe_me.innerHTML = `Processing...`;
                        
                        makePaymentWithCard(
                            payment_vendor.value,
                            firstname.value,
                            lastname.value,
                            email.value,
                            wallet.value,
                            amount.value
                        )
                    }
                    else{
                        if(response.error == false || response.error == "false" ){ 
                            subscribe_me.innerHTML = "Subscribe me";
                            toastr.info(response.message, 'Brooks', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });  
                            subscribe_me.disabled = false  
                            setTimeout(()=>window.location.reload(),1000);
                        }
                        else{
                            subscribe_me.innerHTML = "Subscribe me";
                            toastr.error(response.message, 'Brooks', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });    
                            subscribe_me.disabled = false
                        }
                    }

                }
                else{
                    subscribe_me.innerHTML = `Subscribe me`;                                   
                    toastr.info(response.message, 'Brooks', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    subscribe_me.disabled = false
                }
            })
            .catch((error)=>{
                console.log(error);
                subscribe_me.innerHTML = `Subscribe me`;  
                toastr.error('Something went wront', 'Brooks', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });   
                subscribe_me.disabled = false  
            })

        }


        function makePaymentWithCard(payment_vendor,firstname,lastname,email,wallet,amount){
            var handler = PaystackPop.setup({
                key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
                email: email,
                amount: amount*100,
                currency: "NGN",
                firstname: firstname,
                lastname: lastname,
                channels: ['card'],
                metadata: {
                
                    name: firstname+' '+lastname,
                    wallet: wallet,
                    product:'cooperative'						
                  
                },
                callback: function(response){
                    queryPassed(amount,payment_vendor,response.reference);
                },
                onClose: function(){
                    subscribe_me.innerHTML = "Subscribe me";
                    subscribe_me.disabled = false
                }
            });
            handler.openIframe();   
        }

        async function queryPassed(amount,payment_vendor,reference){
            console.log(remember.checked)
            url = "/brooks/processCardPayment";
            var params = { 
                _token: _token.value,
                amount: amount,
                payment_vendor:payment_vendor,
                remember:remember.checked,
                reference:reference,          
            };

            await fetch(url, {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                credentials:"same-origin",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN':_token.value,
                },
                body: JSON.stringify(params)
            })
            .then((response)=>response.json())
            .then(response=>{                        
                if(response.status=='success'){
                    subscribe_me.innerHTML = "Subscribe me";

                    toastr.success(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else{
                    subscribe_me.disabled = false
                    subscribe_me.innerHTML = "Subscribe me";
                    toastr.error(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

                }
                // console.log(response);
            })
            .catch((error)=>{
                // console.log(error)
                subscribe_me.disabled = false
                subscribe_me.innerHTML = "Subscribe me";
                toastr.error('Something went wrong.', 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            })
    


        }
        // End: Subscribe to cooperative plan



        // Start: Renew of monthly subscriptions
        const renewSub          = document.getElementById('renew-sub');       

        if (renewSub) {
            renewSub.addEventListener('click',()=>{
                renewSub.disabled = true
                switch (paymentMethod.value) {
                    case 'new':                        
                        renewSub.innerHTML = `Processing...`;
                        renewPaymentWithCard(payment_vendor,firstname,lastname,email,wallet,amount);                      
                        break;
                    case 'old':                       
                        renewSub.innerHTML = `Processing...`;
                        renewPaymentWithRecurrent();                      
                        break;
                    case 'divi':                       
                        renewSub.innerHTML = `Processing...`;
                        renewPaymentWithRecurrent();                      
                        break;
                    default:
                        toastr.info('Select payment method', 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                        renewSub.disabled = false
                        break;
                }
            });
        }
       

        function renewPaymentWithCard(payment_vendor,firstname,lastname,email,wallet,amount){
            var handler = PaystackPop.setup({
                key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
                email: email.value,
                amount: amount.value*100,
                currency: "NGN",
                firstname: firstname.value,
                lastname:lastname.value,
                metadata: {

                    name: firstname.value+' '+lastname.value,
                    wallet: wallet.value,
                    product:'cooperative'						
           
                },
                callback: function(response){
                    renewQueryPassed(amount,payment_vendor,response.reference);
                },
                onClose: function(){
                    renewSub.innerHTML = "Re-new sub";
                    renewSub.disabled = false
                }
            });
            handler.openIframe();   
        }


        async function renewQueryPassed(amount,payment_vendor,reference){
            url = "/brooks/renewSubscriptionWithNewCard";
            var params = { 
                _token: _token.value,
                amount: amount.value,
                payment_vendor:payment_vendor.value,
                remember:remember.checked??null,
                reference:reference,          
            };
            
            await fetch(url, {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                credentials:"same-origin",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN':_token.value,
                },
                body: JSON.stringify(params)
            })
            .then((response)=>response.json())
            .then(response=>{                        
                if(response.status=='success'){
                    renewSub.innerHTML = "Re-new sub";

                    toastr.success(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else{
                    renewSub.innerHTML = "Re-new sub";
                    toastr.error(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

                }
                // console.log(response);
            })
            .catch((error)=>{
                // console.log(error)
                renewSub.innerHTML = "Re-new sub";
                toastr.error('Something went wrong.', 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

            })




        }

        async function renewPaymentWithRecurrent() {
            url = "/brooks/renewSubscriptionWithRecurrent";
            var params = { 
                _token: _token.value,
                amount: amount.value,
                payment_vendor:payment_vendor.value,
                payment_method:paymentMethod.value        
            };


                       
            await fetch(url, {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                credentials:"same-origin",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN':_token.value,
                },
                body: JSON.stringify(params)
            })
            .then((response)=>response.json())
            .then(response=>{                        
                if(response.status=='success'){
                    renewSub.innerHTML = "Re-new sub";

                    toastr.success(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                else{
                    renewSub.innerHTML = "Re-new sub";
                    toastr.error(response.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

                }
                // console.log(response);
            })
            .catch((error)=>{
                // console.log(error)
                renewSub.innerHTML = "Re-new sub";
                toastr.error('Something went wrong.', 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

            })

        }

        let pause_untill_present = document.getElementById('pause_untill_present');

        if (pause_untill_present) {
            pause_untill_present.addEventListener('click',()=>{
                pause_untill_present.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span>...`;
                let subscription_status = document.getElementById('subscription_status');
                let = url = "/brooks/subscription/pauseAndPlayUntilPresent";
                let params = {
                    _token:_token.value,
                    subscription_status:subscription_status.value
                }

                axios.post(url, params)
                .then(function (response) {
                    const req = response.data;
                    // console.log(req);
                    if(req.error == false){ 
                        
                        pause_untill_present.innerHTML = "Play";
                        toastr.info(req.message, 'Cooperative subscription', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });;
                    }
    
                    else{
                        pause_untill_present.innerHTML = "Pause";
                        toastr.info(req.message, 'Cooperative subscription', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    }
                })
                .catch(function (error) {
                    // console.log(error);
                    pause_untill_present.innerHTML = "Play";
                    toastr.error('Something went wrong.', 'Cooperative subscription', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                        
                });
            });
        }


        //Terminate Subscription
        var terminate_coop = document.querySelector('.terminate_coop');
        var token = document.querySelector('input[name="_token"]');

        if (terminate_coop) {            
            terminate_coop.addEventListener('click',async()=>{
                terminate_coop.innerHTML = `Processing...`;
                var payment_method = document.querySelector('input[name = payment_method]:checked');
                // console.log(payment_method);
                const params = {
                    payment_method:payment_method?payment_method.value:null
                };

                const response = await fetch('/brooks/terminate',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-CSRF-TOKEN':token.value
                    },
                    body:JSON.stringify(params)
                })
                .then((response)=>response.json())
                .then(req =>{
                    // console.log(req)
                if (req.error == false) {
                    toastr.info(req.message, 'Brooks.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    terminate_coop.innerHTML = `Terminated`;
                   document.querySelector('#terminate-modal').remove();
                   document.querySelector('.modal-backdrop').remove()
                }
                else{
                    toastr.error(req.message, 'Coop.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    terminate_coop.innerHTML = `Terminate`;
                }
                    
                })
                .catch((error)=>{
                    console.log(error)
                })

            })

        }


        //Cancel  subscription termination
        var cancel_termination = document.querySelector('#cancel_termination');
        var token = document.querySelector('input[name="_token"]');

        if (cancel_termination) {
            
            cancel_termination.addEventListener('click',async()=>{
                
                cancel_termination.innerHTML = `Processing...`;
                const response = await fetch('/cooperative/cancel-terminate',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'X-CSRF-TOKEN':token.value
                    },
                    // body:JSON.stringify(params)
                })
                .then((response)=>response.json())
                .then(req =>{
                   
                if (req.error == false) {
                    toastr.info(req.message, 'Coop.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
               
                    cancel_termination.innerHTML = `Canceled`;
                    document.querySelector('#cancel-coop-termination').remove();
                    document.querySelector('.modal-backdrop').remove()

                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                
                //document.getElementById('terminate-modal').classList.remove('modal','fade');
                }
                else{
                    toastr.error(req.message, 'Cooperative.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    cancel_termination.innerHTML = `Yes, cancel`;
                }
                    
                })
                .catch((error)=>{
                    console.log(error)
                })

            })

        }

        
        $paid_to = document.querySelector('#paid_to');
        $brook_data = document.querySelector('#brook-data');
        var token = document.querySelector('input[name="_token"]');
        if ($paid_to) {
            $paid_to.addEventListener('change',async ()=>{
                payload = {
                    _token:token.value,
                    paid_to:paid_to.value
                }
                await fetch('/brooks/change-paidto',{
                    method:"POST",
                    mode:"cors",
                    cache:"no-cache",
                    credentials:"same-origin",
                    headers:{
                        "Content-Type":"application/json",
                        'X-CSRF-TOKEN':token.value,
                    },
                    body: JSON.stringify(payload)
                })      
                .then((response)=>response.json())
                .then(response=>{
                    if (response.status =='success') {
                        $brook_data.innerHTML = response.data;
                        toastr.info(response.message, 'Brooks.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    }
                    else{

                        toastr.error(response.message, 'Brooks.', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    
                    }
                    console.log(response)
                })
                .catch();
            })
        }
});
