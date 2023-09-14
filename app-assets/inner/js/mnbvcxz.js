(function() { 
    const numberOfWithdrawal    = document.querySelector('.numberOfWithdrawal').value; 
    const penalty               = document.querySelector('.penalty').value;
    const apply_penalty         = document.querySelector('.apply_penalty').value; 
    const amount                = document.querySelector('.withdrawal_amount');                
    const withdrawal_method     = document.querySelector('.withdrawal_method');              
    var saveBtn                 = document.querySelector('.saveBtn');
    var withdrawBtn             = document.querySelector('.withdraw_btn');  

        
    var response                = document.getElementById('response');  
    amount.addEventListener('keyup',()=>{
        if(amount.value !=""){   
           var  newamount = amount.value.replaceAll(/[-e]/g,'');
            amount.value = newamount;        
        }               
    });

    withdrawal_method.addEventListener('change', ()=>{
        if (withdrawal_method.value=="add") {
            window.location.href = '/payment/bank';
        }
        // console.log(apply_penalty+'-'+amount.value);
        if(apply_penalty==1 && numberOfWithdrawal >= 1){
        var penaltyAmount = ((parseFloat(penalty)/100)*parseFloat(amount.value));
        var penaltyAlert  = `<div class="alert alert-warning" role="alert">
                                        <button type="button" class="close" data-dismiss="alert">
                                        <span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                        <span> 
                                        You have withdrew ${numberOfWithdrawal} time(s) this month. ${penalty}% (${penaltyAmount.toFixed(2)})
                                        of your withdrawal amount will be charged  
                                        </span></div>`; 
        }else{
            penaltyAlert = "";
        }
        // console.log(penaltyAmount);
    
        switch(withdrawal_method.value){
            case "":  
                response.innerHTML = `<div class="alert alert-info" role="alert">
                                        <button type="button" class="close" data-dismiss="alert">
                                        <span aria-hidden="true">×</span><span class="sr-only">Close</span>
                                        </button><strong>
                                        Select where you want us to transfer your money</strong>
                                        </div>`;      
                setTimeout(() => {
                    response.innerHTML = " ";
                }, 5000);
            break;
            case "add":
                $('#add_bank').modal('show');
            break;
            case "bank":
            case "wallet":
            response.innerHTML = penaltyAlert;
                    
            default:
        }
    
    }); 

    withdrawBtn.addEventListener('click',()=>{
        if(amount.value == ""){
            amount.style.border = "1px solid red";
            setTimeout(() => {
                response.innerHTML = " ";
                amount.style.border = "1px solid #DFE3E7";
            }, 10000);
            return response.innerHTML = '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong> Indicate the amount you want to withdraw.</strong></div>';      
            
        }
        else{                
            amount.style.border = "1px solid #DFE3E7";
        }
        if(withdrawal_method.value == ""){
            withdrawal_method.style.border = "1px solid red";
            setTimeout(() => {
                withdrawal_method.style.border = "1px solid #DFE3E7";
                response.innerHTML = " ";
            }, 10000);
            return response.innerHTML = '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>  Select where you want us to transfer your money</strong></div>';      
            
        }
        else{
            withdrawal_method.style.border = "1px solid #DFE3E7";
        }

        withdrawFromHillsInvestment();
    }); 


    function withdrawFromHillsInvestment(){
        var feedback                = document.getElementById('feedback');  
        withdrawBtn.innerHTML = "Processing...";
        const token             = document.querySelector('input[name="_token"]');   

        var params = { 
            _token: token.value,
            amount: amount.value,
            withdrawal_method:withdrawal_method.value
                
        };  

        axios.post("/hills/withdrawFromHills", params)
        .then(function (response) {
            const req = response.data;

            if(req.error == false){ 
                withdrawBtn.innerHTML = "Withdraw"; 
                toastr.success(req.message, 'Hills', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }

            else{    
                withdrawBtn.innerHTML = "Withdraw";    
                toastr.error(req.message, 'Hills', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
          
                setTimeout(() => {
                    response.innerHTML = " ";
                }, 10000);
            }
        })
        .catch(function (error) {
            console.log(error);
            toastr.error('Something went wrong ', 'Hills', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
     
            feedback.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>  Something went wrong </strong></div>`;
        });
        
    }

})();