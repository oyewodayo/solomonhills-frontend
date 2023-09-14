var amount                    = document.querySelector('#amount');
var interest_rate             = document.querySelector('#interest_rate');
var period                    = document.querySelector('#period');
var calculated_amount         = document.querySelector('#calculated_amount');
var days                        = document.querySelectorAll('input[name="days"]');  
var customday_number            = document.querySelector('#customday_number');
var calculate_interest          = document.querySelector('#calculate_interest');
const customday_number_label    = document.querySelector('#customday_number_label');

const day                       = document.querySelector('#day');
const month                     = document.querySelector('#month');
const year                      = document.querySelector('#year');
const customdate_label          = document.querySelector('#customdate_label');
const print_days                = document.querySelector('#print-days');  
const print_days_div            = document.querySelector('#print-days-div'); 
const estimate_amount           = document.querySelector('#estimate-amount'); 


 
    calculate_interest.addEventListener('click',()=>{
        for(const number_days  of days){
            number_days.addEventListener('change',()=>{
                if (number_days.checked) {
                    // console.log(number_days.value);
                    var number_day =number_days.value;
    
                    if (number_days.value == 'new') {
                        customday_number_label.classList.remove('d-none');
                        number_day = customday_number.value                    
                    }
                    else{
                        customday_number_label.classList.add('d-none');
                    }
                }
             
            });
        }

        calculateEstimatedAmount();
    });
 

    customday_number.addEventListener('keyup',()=>{
        if (customday_number) {
            console.log(customday_number.value);
            let interest_value = interest_rate.value;
            for(const number_days  of days){
                if ( number_days.checked=true) {
                    // calculateEstimatedAmount(number_days.value,customday,period.value,amount.value,interest_value);
                }
               
            } 
         
        }
    });
    customdate.addEventListener('change',()=>{
        if (customdate.checked==true) {
            document.getElementById('all_days').classList.add('d-none');
            document.getElementById('custom_daysn').classList.add('d-none');            
            document.getElementById('customdate_label').classList.remove('d-none'); 
            for(const number_days  of days){
                number_days.checked=false;
            }           
        }
        if (customdate.checked==false) {
            document.getElementById('all_days').classList.remove('d-none');
            document.getElementById('customdate_label').classList.add('d-none');
            document.getElementById('custom_daysn').classList.remove('d-none');
        }
    });

    function calculateEstimatedAmount() {
        var amount                    = document.querySelector('#amount');
        var interest_rate             = document.querySelector('#interest_rate');
        var frequency                 = document.querySelector('#period');
        var days                      = document.querySelectorAll('input[name="days"]'); 
        var customday_number          = document.querySelector('#customday_number');
        for(var number_days  of days){
            number_days.addEventListener('change',()=>{
               
                    if (number_days.value == 'new') {
                        customday_number_label.classList.remove('d-none');
                        number_days = customday_number.value                    
                    }
                    else{
                        customday_number_label.classList.add('d-none');
                        number_days = number_days.value    
                    }
           
            })
        }

        switch (frequency.value) {
            case 'monthly':
               if (number_days =="new") {
                    var principal_amount = number_days.value*amount;
               }else{
                    var convert_days_to_months = Math.round(number_days/30.4167);
                    var principal_amount = convert_days_to_months*amount;
               }

                break;
            case 'weekly':
                if (number_days =="new") {
                    var principal_amount = number_days.value*amount;
               } else {
                    var convert_days_to_weeks = Math.round(number_days/7);
                    var principal_amount = convert_days_to_weeks*amount; ;
               }

                break;
            case 'daily':
                if (number_days =="new") {
                    var principal_amount = number_days.value*amount;
                } else {
                    var principal_amount = number_days*amount;
                }

                    break;
        
            default:
              
                var principal_amount = number_days*amount;
                break;
        }
        
        let interest = (interest_rate.value/100)*principal_amount;
        let estimated = principal_amount+interest;
        console.log('Interest= '+interest+' Principal= '+principal_amount+' Estimated= '+estimated);
        estimate_amount.innerHTML=`<div>Estimated</div> <div style="margin-top:10px"> <small class="font-small-1" >at ${interest_rate.value}% interest rate</small><div><small class="text-primary text-bold-600"> ${estimated}</small>`;
    }

    day.addEventListener('change',()=>{
     
        if (day.value !="" && month.value !="" && year.value !="") {
         print_days_div.classList.remove('d-none') ;
         console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
        //  print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1]; 
        }
    });
    month.addEventListener('change',()=>{
        if (day.value !="" && month.value !="" && year.value !="") {
         print_days_div.classList.remove('d-none') ;
         console.log(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]);
         print_days.innerHTML=Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]))+' '+dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[1];
         let number_of_days =  Math.round(Math.abs(dateDiff(year.value+'-'+month.value+'-'+day.value,period.value)[0]));
        //  calculateEstimatedAmount(number_of_days,custom_day,period.value,amount.value,interest_rate.value)
       
        }
    });
