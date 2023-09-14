(function() {
    const paymentMethod     = document.querySelector('.paymentMethod');
    const period            = document.querySelector('.period'); 
    const save_month        = document.querySelector('.save_month');
    const save_day          = document.querySelector('.save_day'); 
    const save_div          = document.querySelector('.save_div');  
    const amount_div        = document.querySelector('#amount_div');
    const amount            = document.querySelector('#savings_amount');
    const period_div        = document.querySelector('#period_div');
    const goal_div          = document.querySelector('#goal_div');
    const goal              = document.querySelector('select[name="goal"]');  
    const write_goal        = document.querySelector('#write_goal');
    const write_goal_div    = document.querySelector('#write_goal_div');        
    const withdrawal_div    = document.querySelector('#withdrawal_div');
    const withdrawal_date   = document.querySelector('#withdrawal_date');
    const day               = document.querySelector('#day');
    const month             = document.querySelector('#month');
    const year              = document.querySelector('#year');
    const payment_div       = document.querySelector('#payment_div');
    const submit_div        = document.querySelector('#submit_div');
    const savings_type      = document.querySelector('#savings_type');
    const saving_percentage = document.querySelector('#saving_percentage');        
    const salary_div        = document.querySelector('#salary_div');
    const salary            = document.querySelector('#salary');
    const calculated_amount = document.querySelector('#calculated_amount');
    const maturity_date     = document.querySelector('#maturity-date');
    const days              = document.querySelectorAll('input[name="days"]');  
    const custom_day        = document.querySelector('input[name="custom_day"]'); 
    const selected_days     = document.querySelector('#selected-days');
    const print_days        = document.querySelector('#print-days');  
    const print_days_div    = document.querySelector('#print-days-div'); 
    const estimate_amount   = document.querySelector('#estimate-amount'); 
    const interest_rate   = document.querySelector('#interest_rate'); 


    if (savings_type) {
        savings_type.addEventListener('change', (amount)=>{            
            if(savings_type.checked == true){
                amount_div.style.display="none";
                salary_div.style.display="block";
            
            }
            else{
                amount_div.style.display="block";
                salary_div.style.display="none";
            }          
        });
    }
    
    if (salary) {
        salary.addEventListener('keyup',()=>{
            if(salary !=="" && saving_percentage !==""){  
                       
                 salary.value =`${salary.value.replaceAll(/₦|[\\//<>]|[@!`~$*&)(?=_+;'":}\][{\]]|-|%|[a-zA-Z]/g,'')}`
                 calculated_amount.value = `₦${(saving_percentage.value/100)*salary.value.replaceAll(/₦|,|%|[a-zA-Z]/g,'')}`;
                
                 //alert((saving_percentage.value/100)*salary.value);
             }
         }); 
    }
  
    if (saving_percentage) {
        saving_percentage.addEventListener('keyup',()=>{
            if(saving_percentage){    
                calculated_amount.style.display="block";     
                period_div.style.display ="block";
                calculated_amount.value = `₦${(saving_percentage.value/100)*salary.value.replaceAll(/₦|,|%|[a-zA-Z]/g,'')}`;
            
                //alert((saving_percentage.value/100)*salary.value);
            }
            else{
                calculated_amount.style.display="none";  
                period_div.style.display ="none";
            }
        }); 
    }
   
    if (amount) {
        amount.addEventListener('keyup',()=>{
            if(amount.value !=""){   
                // console.log(amount.value);
                newamount = amount.value.replaceAll(/[-e]/g,'');
                amount.value = newamount;        
                period_div.style.display ="block";
            }
            if(amount.value ==""){ 
                period_div.style.display ="none";
            }
            yearCallback();
        });
    }
    



    // When Frequency of savings is changed
    if (period) {
        period.addEventListener('change',()=>{
            if (day.value !="" && month.value !="" && year.value !="") {
             print_days_div.classList.remove('d-none') ;
            //  console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
             print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1]; 
             let number_of_days = Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]));
             calculateEstimatedAmount(number_of_days,custom_day,period.value,amount.value)        
            }
            else{
                if (days.checked) {
                    for(const number_days  of days){
                        number_days.addEventListener('change',()=>{
                            if (number_days.checked) {
                                // console.log(number_days.value);
                                var number_day =number_days.value;
                            }
                        });
                    }
                }
            }
    
            if(period.value=="monthly") {
                save_div.style.display= "block";
                save_month.style.display= "block";
                save_day.style.display= "none";
                 goal_div.style.display = "block";
                 withdrawal_div.style.display = "block";
                 payment_div.style.display ="block";
            }
            else if(period.value=="weekly"){
                save_div.style.display= "block";
                save_day.style.display= "block";
                save_month.style.display= "none";
                goal_div.style.display = "block";
                withdrawal_div.style.display = "block";
                payment_div.style.display ="block";
            }
            else if(period.value=="daily"){
                save_div.style.display= "none";
                save_day.style.display= "none";
                save_month.style.display= "none";
                goal_div.style.display = "block";
                withdrawal_div.style.display = "block";
                payment_div.style.display ="block";
            }
            else {
                save_div.style.display= "block";
                save_day.style.display= "none";
                save_month.style.display= "block";
                goal_div.style.display = "block";
                withdrawal_div.style.display = "block";
                payment_div.style.display ="block";
            }
        });
    }
 

    for(const number_days  of days){
        number_days.addEventListener('change',()=>{
            if (number_days.checked) {
                // console.log(number_days.value);
                var number_day =number_days.value;
                calculateEstimatedAmount(number_days.value,custom_day,period.value,amount.value)
                if (number_days.value == 270) {
                    document.querySelector('#my-message').innerHTML=`<div class="text-success mb-1"> <img src="/icons/leaves.svg" class="align-middle" width="15" height="15" alt="baby">  Expecting a baby in 9 months time? <a href="#" class="close cursor-pointer" id="close">&times;</a></div>`; 
                    document.querySelector('#close').addEventListener('click',()=>{
                        document.querySelector('#my-message').style.display="none";
                    });

                    setTimeout(function() {
                        document.querySelector('#my-message').style.display="none";
                    }, 10000);
                }
                else{
                    document.querySelector('#my-message').innerHTML="";
                }
            }
        });
    }

    custom_day.addEventListener('change',()=>{
        if (custom_day.checked== true) {
            maturity_date.classList.remove('d-none');
            selected_days.classList.add('d-none');
            let number_day;
            
            for(const number_days  of days){
                number_days.checked = false;
            }

        } else {
            days.checked=false;
            print_days_div.classList.add('d-none') ;
            maturity_date.classList.add('d-none');
            selected_days.classList.remove('d-none');
        }
    })
   

    function calculateEstimatedAmount(number_days,custom_day,frequency,amount) {
        switch (frequency) {
            case 'monthly':
               if (custom_day.checked) {
                    var principal_amount = number_days*amount;
               }else{
                    var convert_days_to_months = Math.round(number_days/30.4167);
                    var principal_amount = convert_days_to_months*amount;
               }

                break;
            case 'weekly':
               if (custom_day.checked) {
                    var principal_amount = number_days*amount;
               } else {
                    var convert_days_to_weeks = Math.round(number_days/7);
                    var principal_amount = convert_days_to_weeks*amount; ;
               }

                break;
            case 'daily':
                if (custom_day.checked) {
                    var principal_amount = number_days*amount;
                } else {
                    var principal_amount = number_days*amount;
                }

                    break;
        
            default:
                var principal_amount = number_days*amount;
                break;
        }
        // console.log('NGN'+principal_amount);
        let interest = (interest_rate.value/100)*principal_amount;
        let estimated = principal_amount+interest;
        estimate_amount.innerHTML=`
        <div>Estimated</div> 
        <div style="margin-top:-10px"> 
        <small class="font-small-1" >at ${ numeral(interest_rate.value).format('0,0.00')}% interest rate</small>
        </div>
        <div>
        <small class="text-primary text-bold-600"> ₦${numeral(estimated).format('0,0.00')}</small>
        </div>
    `;
    }

    day.addEventListener('change',()=>{
     
        if (day.value !="" && month.value !="" && year.value !="") {
         print_days_div.classList.remove('d-none') ;
        //  console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
         print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1]; 
        }
    });
    month.addEventListener('change',()=>{
        if (day.value !="" && month.value !="" && year.value !="") {
         print_days_div.classList.remove('d-none') ;
        //  console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
         print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1];
         let number_of_days =  Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]));
         calculateEstimatedAmount(number_of_days,custom_day,period.value,amount.value)
       
        }
    });

    function yearCallback() {
        year.addEventListener('change',()=>{
            if (day.value !="" && month.value !="" && year.value !="") {
            print_days_div.classList.remove('d-none') ;
            // console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
            print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1]; 
            }
            let number_of_days =  Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]));
        
            calculateEstimatedAmount(number_of_days,custom_day,period.value,amount.value)
        }); 
    }
    yearCallback();


    goal.addEventListener('change',()=>{

        if(goal.value == "write"){
          
            write_goal_div.style.display ="block";
        }
        else{
            write_goal_div.style.display ="none";
        }
    });


    paymentMethod.addEventListener('change',()=>{
        if(paymentMethod.value==""){
         $('#response').html('<div class="alert alert-info col-md-12" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong> Select payment method</strong></div>');
  
        submit_div.style.display ="none";
        }

        if(paymentMethod.value=="card" || paymentMethod.value=="wallet") {
          
            submit_div.style.display ="block";
   
            $('#response').html('');
        }
        if(paymentMethod.value=="chargeback" || paymentMethod.value=="wallet") {
            submit_div.style.display ="block";
     
            $('#response').html('');
        }
       
    }); 


    
    var saveBtn                     = document.querySelector('#saveBtn'); 
    saveBtn.addEventListener('click',validateSavingData );
 
    //Submit Savings form
    function validateSavingData(){
        const user_id           = document.querySelector('.user_id'); 
        const firstname         = document.querySelector('.firstname'); 
        const lastname          = document.querySelector('.lastname');
        const email             = document.querySelector('.email'); 
        const phone             = document.querySelector('.phone'); 
        const wallet            = document.querySelector('.wallet'); 
        const amount            = document.querySelector('#savings_amount');
        const salary            = document.querySelector('#salary');        
        const period            = document.querySelector('.period');
        const save_month        = document.querySelector('.save_month');
        const save_day          = document.querySelector('.save_day');
        const goal              = document.querySelector('.goal');
        const write_goal        = document.querySelector('.write_goal');        
        const withdrawal_date   = document.querySelector('.withdrawal_date'); 
        const day               = document.querySelector('#day');
        const month             = document.querySelector('#month');
        const year              = document.querySelector('#year');      
        const paymentMethod     = document.querySelector('.paymentMethod');  
        const savings_type      = document.querySelector('#savings_type');
        const saving_percentage         = document.querySelector('#saving_percentage');  
        const payment_vendor            = document.querySelector('#payment_vendor');
        var response                    = document.getElementById('response');  
        var feedback                    = document.getElementById('feedback');  

        let number_day;
        for(const number_days  of days){
            if (number_days.checked) {
                 number_day = number_days.value;
            }

        }
        
        saveBtn.innerHTML = "Processing..."
        
        var token          = document.querySelector('input[name="_token"]').value; 
        
        var params = { 
            _token: token,
            user_id:user_id.value,
            amount: amount.value.replaceAll(/₦|,/g,''),
            salary:salary.value.replaceAll(/₦|,/g,''),
            savings_type:savings_type.checked,
            period:period.value,
            save_month:save_month.value,
            save_day:save_day.value,
            goal:goal.value,
            write_goal:write_goal.value,
            number_day:number_day,
            day:day.value ,
            month:month.value,
            year:year.value         
        };          

        axios.post("/savings/validateSaving", params)
        .then(function (response) {
            const req = response.data;
            // console.log(req);
            if(req.error == false || req.error == 'false' ){  
                saveBtn.innerHTML =req.data+'...';  
                    processSavings(
                            payment_vendor.value,
                            savings_type.checked,
                            saving_percentage.value.replaceAll(/₦|,|%|[a-zA-Z]/g,''),
                            salary.value.replaceAll(/₦|,/g,''),
                            user_id.value,
                            firstname.value,
                            lastname.value,
                            email.value,
                            phone.value,
                            wallet.value,
                            amount.value.replaceAll(/₦|,/g,''),
                            period.value,
                            save_month.value,
                            save_day.value,
                            goal.value,
                            write_goal.value,
                            number_day,
                            day.value,
                            month.value,
                            year.value,
                            paymentMethod.value,
                            saveBtn,
                            response
                        )   
                
                }

                else{
                    saveBtn.innerHTML =' Create bucket '; 
                    feedback.innerHTML = `<div class="col-md-12 alert alert-info alert-dismissible">* ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
                         
                }
        })
        .catch(function(error){
            saveBtn.innerHTML = " Create bucket ";
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Somethinh went wrong <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        });
    }

    function processSavings(payment_vendor,savings_type,saving_percentage,salary,user_id,firstname,lastname,email,phone,wallet,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,paymentMethod,saveBtn,response){
        switch (paymentMethod) {
            case "card":    
                paySavingsWithCard(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;
            case "wallet":  
                saveCreateWithWallet(payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,saveBtn,response);
                break;

            case "chargeback":                                
                chargeBack(paymentMethod,payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;
        
            default:              
                paySavingsWithCard(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;
        }
    }


    function paySavingsWithCard(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year){

        switch(payment_vendor){
            case "flutterwave":
                saveWithFlutterWave(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;
            case "paystack":
                saveWithPayStack(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;

            default:
                saveWithPayStack(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year);
                break;
        }  
    }



    function saveWithFlutterwave(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,number_day,day,month,year){

        if(savings_type==true || savings_type== 1 || savings_type== "on"){
            amount = ((saving_percentage/100)*salary);
        }
    
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email,
            amount: amount*100,
            currency: 'NGN',
            firstname: firstname,
            lastname: lastname,
            // channels: ['bank','card'],
            metadata: {
               
                    name: firstname+' '+lastname,
                    wallet: wallet,
                    product:'bucket'
                
            },
            callback: function(response){
                setQuery(payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,response.reference);  
            },
            onClose: function(){
                setTimeout(function() {
                        window.location.reload();
                    }, 1000);
            }
        });
        handler.openIframe(); 
    }

    function saveWithPayStack(payment_vendor,savings_type,saving_percentage,salary,firstname,lastname,email,phone,wallet,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year){
        var saveBtn             = document.querySelector('.saveBtn');   
    
        if(savings_type==true || savings_type== 1 || savings_type== "on"){
            amount = ((saving_percentage/100)*salary);
        }
        
        // pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email,
            amount: amount*100,
            currency: 'NGN',
            firstname: firstname,
            lastname: lastname,
            label:'Bucket',
            channels: ['card'],
            metadata: {
 
                name: firstname+' '+lastname,
                wallet: wallet,
                product:'bucket',

            },
            callback: function(response){
                setQuery(payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,response.reference);  
            },
            onClose: function(){
                saveBtn.innerHTML = " Create bucket "; 
            }
        });
        handler.openIframe(); 
    }
             


    function setQuery(payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,reference){
        var token          = document.querySelector('input[name="_token"]').value;   
        var saveBtn        = document.querySelector('.saveBtn');            
        var response       = document.getElementById('response');  
        switch(payment_vendor){
            case "flutterwave":
                url = "/savings/saveWithFlutterwaveCard";
                break;
            case "paystack":
                url = "/savings/saveWithPaystackCard"
            break;
            default:
                url = "/savings/saveWithPaystackCard"
                break;
        }

        let paramss = { 
            _token: token,
            savings_type:savings_type,
            saving_percentage:saving_percentage,
            salary:salary,
            user_id:user_id,
            amount: amount,
            period:period,
            save_month:save_month,
            save_day:save_day,
            goal:goal,
            number_day:number_day,
            day:day,
            month:month,
            year:year,
            transactionRef:reference      
        };


        axios.post(url, paramss)
        .then(function (response) {
            const req = response.data;
            if(req.error == false || req.error == 'false' ){  
                    saveBtn.innerHTML = " Save "; 
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                                                     
                    setTimeout(function() {
                    window.location.href="/dashboard";
                    }, 1000);
                }

                else{
                    saveBtn.innerHTML = " Create bucket ";
                    feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                            
                }
        })
        .catch(function(error){
            saveBtn.innerHTML = " Create bucket ";
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Somethinh went wrong <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        });
    }


    function saveCreateWithWallet(payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year,saveBtn,response){
        var token          = document.querySelector('input[name="_token"]').value;      
        var params = { 
            _token: token,
            user_id:user_id,
            savings_type:savings_type,
            saving_percentage:saving_percentage,
            salary:salary,
            amount: amount,
            period:period,
            save_month:save_month,
            save_day:save_day,
            goal:goal,
            write_goal:write_goal,
            number_day:number_day,
            day:day,
            month:month,
            year:year,        
        };

    

        axios.post("/savings/saveWithWallet", params)
        .then(function (response) {
            const req = response.data;
            if(req.error == false || req.error == "false" ){ 
                saveBtn.innerHTML =' Create bucket '; 
                feedback.innerHTML ='<div class="alert alert-success mb-2" role="alert">'+req.data+'</div>';   response.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                                       
                setTimeout(function() {
                window.location.href="/dashboard";
                }, 1000);
            }

            else{                    
                saveBtn.innerHTML =' Create bucket ';  
                feedback.innerHTML = `<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"> <span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong> <i class="fa fa-warning" style="font-size:20px"> </i> ${req.data} </strong></div>`; 
                setTimeout(function() {
                    response.innerHTML ="";
                    }, 5000);
            }
        })
        .catch(function(error){
            saveBtn.innerHTML = " Create bucket "
                feedback.innerHTML = '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong class=""> <i class="fa fa-warning" style="font-size:20px"> </i>  Something went wrong </strong></div>';
        });

    }



    function chargeBack(paymentMethod,payment_vendor,savings_type,saving_percentage,salary,user_id,amount,period,save_month,save_day,goal,write_goal,number_day,day,month,year){
        
        var saveBtn             = document.querySelector('.saveBtn');            
        var response            = document.getElementById('response');  
    
        const token             = document.querySelector('input[name="_token"]').value; 
        let url                 = "/savings/savingsChargeBack";

        switch(payment_vendor){
            case "paystack":
                url = "/savings/savingsChargeBack";
            break;
            default:
                url = "/savings/savingsChargeBack";
                break;
        }
     
        var params = {  _token: token,
                savings_type:savings_type,
                saving_percentage:saving_percentage,
                salary:salary,
                user_id:user_id,
                amount: amount,
                period:period,
                save_month:save_month,
                save_day:save_day,
                goal:goal,
                number_day:number_day,
                day:day,
                month:month,
                year:year
            };



        axios.post(url, params)
        .then(function (response) {
            const req = response.data;
            if(req.error == false){
                saveBtn.innerHTML = " Create bucket ";
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
                setTimeout(function() {
                window.location.href="/dashboard";
                }, 1000);
            }
            else{
                saveBtn.innerHTML = " Create bucket ";
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> ${req.data}<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
               
            }
        })
        .catch(function(error){
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Something went wrong <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;            
               
                saveBtn.innerHTML = " Create bucket ";
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
            var stamp = 'months';
                break;
            case 'weekly':
            var numPeriods         = timeDiff/milliSecInWeeks;
            var stamp = 'weeks';
                break;
            case 'daily':
            var numPeriods         = timeDiff/milliSecInDays;
            var stamp = 'days';
                break;
            default:
            var numPeriods         = timeDiff/milliSecInDays;
            var stamp = 'days';
                break;
        }

        return [numPeriods,stamp];
    }
})();