
window.addEventListener('DOMContentLoaded', ()=>{
   
    const subscription          = document.getElementById('subscription'); 
    const add_guarantor         = document.getElementById('add-guarantor'); 
    const loan_amount           = document.getElementById('loan_amount'); 
    const guarantor             = document.querySelector('#guarantor'); 
    const narration             = document.querySelector('#narration'); 
    const request_loan          = document.querySelector('#request_loan');         
    const guarantor_response    = document.querySelector('#g_response');  
    var token                   = document.querySelector('input[name="_token"]'); 

    //Remove the filter values in [] form the amount input
    if (loan_amount) {
        loan_amount.addEventListener('keyup',()=>{
            if(loan_amount.value !=""){   
                newamount = loan_amount.value.replaceAll(/[-e]/g,'');
                loan_amount.value = newamount;        
            }               
        });
    }

    if (loan_amount) {
        loan_amount.addEventListener('keyup',()=>{
            // console.log(parseFloat(loan_amount.value) >= parseFloat(subscription.value));
            if(loan_amount.value != "" && parseFloat(loan_amount.value) >= parseFloat(subscription.value)){   
               add_guarantor.classList.remove('d-none');     
            }
            else{
                add_guarantor.classList.add('d-none');    
            }               
        });
    }


    if (guarantor) {
        guarantor.addEventListener('keyup',()=>{
            if(guarantor.value !=""){  
                validateGuarantor(); 
            }          
        });     
    }


    function validateGuarantor() {
        // console.log(guarantor.value);
        let url = "/brooks/loan/checkGuarantor";
        params = {
            token:token.value,
            guarantor:guarantor.value
        }
        axios.post(url, params)
        .then(function (response) {
            const req = response.data;
        
            if(req.error == false){ 
                guarantor_response.innerHTML = `<span class="text-success">${req.data}</span> will be notify to acknowledge your request.`;
                
            }

            else{
                guarantor_response.innerHTML = `<span>${req.message}</span>`;
            }
        })
        .catch(function (error) {
            console.log(error);
            renewSub.error(req.message, 'Cooperative', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
        });
    }


    if (request_loan) {
        request_loan.addEventListener('click',()=>{ 
            requestForLoan();       
        }); 
    }

    

    function requestForLoan() {
        request_loan.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`;
        url = "/brooks/loan/request/post";
        var params = { 
            _token: token.value,
            amount: loan_amount.value,
            guarantor:guarantor.value,
            narration:narration.value        
        };

        // console.log(JSON.stringify(params));
        axios.post(url, params)
        .then(function (response) {
            const req = response.data;
        
            if(req.error == false){ 
                request_loan.innerHTML = "Send request";
                toastr.info(req.message, 'Brooks: loan request', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

            else{
                request_loan.innerHTML = "Send request";
                toastr.info(req.message, 'Brooks: loan request', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            
            }
        })
        .catch(function (error) {
            request_loan.innerHTML = "Send request";
            console.log(error);
            toastr.error(req.message, 'Cooperative: loan request', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
        });

    }
             
    const account_name          = document.querySelector('.account_name'); 
    const email                 = document.querySelector('.account_email');  
    const wallet                = document.querySelector('.account_wallet'); 
    const loan_reference        = document.querySelector('#loan_reference');
    const repayment_amount      = document.querySelector('.repayment_amount');                 
    const payment_method        = document.querySelector('#payment_method');                 
    const payment_button        = document.querySelector('#payment_button');    



    if (payment_button) {
        payment_button.addEventListener('click',()=>{
            payment_button.innerHTML=`<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span>`;
            processCardPayment();
        });

    }

    function processCardPayment() {
        payload = {
            token:token.value,
            loan_reference:loan_reference.value,
            repayment_amount:repayment_amount.value,
            payment_method:payment_method.value
        }


        axios.post("/cooperative/loan/process/repayment", payload)
        .then(function (response) {
            const req = response.data;
            // console.log(response);
            // console.log(req);
            if(req.error == false || req.error == "false" ){ 
                // console.log(req);
                if(req.message=="processing"){ 
                    // alert(repayment_amount+'|'+loan_reference);                  
                    payWithPayStack(account_name,email,wallet,repayment_amount.value,loan_reference);
                }
                else{ 
                    payment_button.innerHTML="Pay now"                                       
                    toastr.info(req.message, 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    setTimeout(()=>{
                        window.location.reload()
                    },1000);
                }
    
            }
            else{
                payment_button.innerHTML="Pay now" 
                toastr.info(req.message, 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            }
        })
        .catch(function (error) {
            console.log(error);
            payment_button.innerHTML="Pay now" 
            toastr.info('Something went wrong', 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        });
    }

    function payWithPayStack(account_name,email,wallet,repayment_amount,loan_reference){
        // var pa               = document.querySelector('.pay_with_card');
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email.value,
            amount: repayment_amount*100,
            name: account_name.value,
            channels: ['card'],
            metadata: {
                custom_fields: [
                    {
                        name: account_name.value,
                        wallet: wallet.value,
                        reference:loan_reference.value,
                        product:'loan'						
                    }
                ]
            },
            callback: function(response){
                // console.log(response);
                queryPassed(repayment_amount.value,loan_reference.value,response.reference);
            },
            onClose: function(){
                payment_button.innerHTML="Pay now" 
            }
        });
        handler.openIframe();   
    }




    function queryPassed(amount,loan_reference,reference){
        var token                      = document.querySelector('input[name="_token"]'); 

        var params = { 
            _token: token,
            repayment_amount: amount,
            loan_reference:loan_reference,
            reference:reference,          
        };


        axios.post("/cooperative/loan/repayment/card", params)
        .then(function (response) {
            const req = response.data;        
            if(req.error == false || req.error == "false" ){ 
                payment_button.innerHTML="Pay now"                       
                toastr.info(req.message, 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                setTimeout(()=>{
                    window.location.reload()
                },1000);
            }
            else{
                payment_button.innerHTML="Pay now" 
                toastr.info(req.message, 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            
            }
        })
        .catch(function (error) {
            console.log(error);
            payment_button.innerHTML="Pay now" 
            toastr.error(req.message, 'Loan re-payment', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            
        });

    }
    // End: Renew of monthly subscriptions
});
