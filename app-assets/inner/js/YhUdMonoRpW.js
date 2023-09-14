window.addEventListener('DOMContentLoaded', ()=>{

    /*
    |   Connect and retrieve account balance of Bank account
    |   - Start
    */
    
    var launch = document.getElementById('launch-btn');
    var financials_feedback = document.getElementById('financials_feedback');
    var financial_preview = document.getElementById('financial_preview');

    var token          = document.querySelector('input[name="_token"]').value; 
 
    var connect;
    var config = {
        
    key: "test_pk_65viEubbiMyiGxeIlvud",
    onSuccess: function (response) {
     
        launch.innerHTML=`<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Connecting...`
       
        copyToClipboard(response.code);
        response.token = token;
        axios.post("/financials/getAccountID", response)
        .then(function (res) {
            const req = res.data;
            console.log(req);
            console.log(req.data);
            console.log(req.data.message);
            console.log(req.data.data.balance);
        
 
            if(req.data.error == false){ 
             
                if (window.location.href !="/financials/accounts") {
                    launch.innerHTML = "Click here"; 
                }
                else{
                    launch.innerHTML = ""; 
                }
                toastr.success(req.data.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
     
                // financials_feedback.innerHTML = `<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.data.message} </span></div>`; 
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }

            else{    

                if (window.location.href !="/financials/accounts") {
                    launch.innerHTML = "Click here"; 
                }
                else{
                    launch.innerHTML = ""; 
                }

                toastr.info(req.data.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
           
                // financials_feedback.innerHTML = `<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.data.message} </span></div>`; 
               
            }
        })
        .catch(function (error) {
            if (window.location.href !="/financials/accounts") {
                launch.innerHTML = "Click here"; 
            }
            else{
                launch.innerHTML = ""; 
            }  
            console.log(error);
            toastr.error('Something went wrong', 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
     
            // feedback.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>  Something went wrong </strong></div>`;
        });
    },
    onClose: function () {
        if (window.location.href !="/financials/accounts") {
            launch.innerHTML = "Click here"; 
        }
        else{
            launch.innerHTML = ""; 
        }         
        console.log('user closed the widget.')
    }
    };
    connect = new Connect(config);
    connect.setup();
    if(launch){
        launch.onclick = function (e) {
            launch.innerHTML=`<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing...`
            connect.open();
    }

    };

    /*
    |   Connect and retrieve account balance of Bank account
    |   - End
    |   -------------------------------------------------------------------------------------------------------------------------------
    */




    /*
    |   Refresh selected account and return the account balance
    |   - Start
    */

    var refresh_personal_account = document.querySelectorAll('#refresh_personal_account');

    
    for (let account of Array.from(refresh_personal_account)) {
        // console.log(account)
        account.addEventListener('click',(event)=>{
            event.preventDefault;
            var personal_account_id = account.dataset.account;

            console.log(personal_account_id)
            params = {
                token:token,
                personal_account:personal_account_id
            }
            account.innerHTML=`<i class='bx bx-sync bx-spin bx-sm align-middle'></i>`;
            axios.post("/financials/refreshAccountBalance", params)
            .then(function (response) {
                account.innerHTML=`<span class='bx bx-sync bx-spin text-success bx-sm align-middle'></span>`;
                const req = response.data;
                console.log(req);
                if(req.error == false){ 
                    account.innerHTML=`<i class='bx bx-sync bx-sm align-middle'></i>`;
                    toastr.info(req.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
     
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);  
                    ;
                }

                else{    
                    account.innerHTML=`<i class='bx bx-sync bx-sm align-middle'></i>`;     
                    toastr.info(req.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                }
            })
            .catch(function (error) {
                account.innerHTML=`<i class='bx bx-sync bx-sm align-middle'></i>`;
                console.log(error);
                toastr.info('Something went wrong', 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            });

        });        
    }


    /*
    |   Refresh selected account and return the account balance
    |   - End
    |   -------------------------------------------------------------------------------------------------------------------------------    */





    /*
    |   Unlink selected account and return the account balance
    |   - Start
    */

    var unlink_personal_account = document.querySelectorAll('#unlink_account');
    var feedback = document.querySelectorAll('.feedback');
    for (let unlink of Array.from(unlink_personal_account)) {
        // console.log(account)
        unlink.addEventListener('click',(event)=>{
            event.preventDefault;
            var personal_account_id = unlink.dataset.account;

            console.log(personal_account_id)
            params = {
                token:token,
                personal_account:personal_account_id
            }
            unlink.innerHTML=`<i class='bx bx-radio-circle bx-burst bx-sm align-middle'></i>Unlinking...`;
            axios.post("/financials/unlinkAccount", params)
            .then(function (response) {
                unlink.innerHTML=`<i class='bx bx-radio-circle bx-burst bx-sm align-middle'></i>Unlinking...`;
                const req = response.data;
                console.log(req);
                if(req.error == false){ 
                    unlink.innerHTML=`Unlinked`;
                    feedback.innerHTML = `<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.message} </span></div>`;   
                    window.location.reload();
                }

                else{    
                    unlink.innerHTML=`Yes, unlink`;     
                    feedback.innerHTML = `<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.message} </span></div>`; 
                }
            })
            .catch(function (error) {
                unlink.innerHTML=`Yes, unlink`;
                console.log(error);
                feedback.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>  Something went wrong </strong></div>`;
            });

        });        
    }


    /*
    |   Refresh selected account and return the account balance
    |   - End
    |   -------------------------------------------------------------------------------------------------------------------------------    */




    /*
    |   Move Money from Bank to Selected product
    |   - Start
    */

 
    var move_money_btn          = document.getElementById('move_money_btn');
    var move_feedback           = document.getElementById('move-feedback');
    var amount_to_move          = document.getElementById('amount_to_move');
    var move_to_destination     = document.getElementById('move_to_destination');
    var personal_account        = document.getElementById('personal_account');
    var token                   = document.querySelector('input[name="_token"]').value; 
    var my_callback             = document.getElementById('my_callback');
    
    if (move_money_btn) {
        move_money_btn.addEventListener('click',()=>{
            if (amount_to_move.value == "") {
                amount_to_move.style.border ="1px solid red";
                return true;
            }
            if (amount_to_move.value != "") {
                amount_to_move.style.border ="";        
            }
    
            if (move_to_destination.value =="") {
                move_to_destination.style.border ="1px solid red";  
                return true; 
            }else{
                move_to_destination.style.border ="";  
            }
    
            var params = {
                token:token,
                amount:amount_to_move.value,
                destination:move_to_destination.value,
                personal_account:personal_account.value
            }
            move_money_btn.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Processing... `;
            axios.post("/financials/movemoney", params)
            .then(function (response) {
                move_money_btn.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Moving... `;
                const req = response.data;
                console.log(req);
                if(req.error == false){ 
                    move_money_btn.innerHTML = `Move now`;
                    launch.innerHTML = "Click here"; 
                    window.location.href = req.data;
                    move_feedback.innerHTML = `<div class="alert alert-success" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.message} </span></div>`; 
                       
                }
    
                else{    
                    move_money_btn.innerHTML = `Move now`;         
                    move_feedback.innerHTML = `<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><span> ${req.message} </span></div>`; 
                   
                }
            })
            .catch(function (error) {
                move_money.innerHTML = `Move now`;
                console.log(error);
                move_feedback.innerHTML = `<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button><strong>  Something went wrong </strong></div>`;
            });
    
        });
    
    }
  

    /*
    |   End- Moved Money from Bank to Selected product ----------------------------------------------------------------------------
    */





    function getAccurateDate(days,progression) {
        let tdate = new Date();
        switch (progression) {
            case 'plus':
                tdate.setDate(tdate.getDate()+days)
                break;
            case '+':
                tdate.setDate(tdate.getDate()+days)
                break;
            case 'minus':
                tdate.setDate(tdate.getDate()-days)
                break;
            case '-':
                tdate.setDate(tdate.getDate()-days)
                break;
        
            default:
                alert('input correct second parameter.')
                break;
        }
    
        return tdate.toISOString()
    }

    function lastmonth() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        if (month==0) {
            year=year-1;
        }
        var lastday = new Date(year,month,01);

        var end_date = new Date(year,month,01);
        var start_date = year+'-'+month+'-'+'01';
        var new_start_date = new Date(start_date);

        var actual_date = {'start_date':new_start_date.toISOString().split("T")[0],'end_date':end_date.toISOString().split("T")[0]};
        // var actual_date = {'start_date':year+'-'+month+'-'+'01','end_date':year+'-'+month-+'-'+lastday};
        return actual_date;
    }

    let custom_yesterday    = document.querySelector('#custom-yesterday');
    let custom_ylast7days   = document.querySelector('#custom-last7days');
    let custom_2weeks       = document.querySelector('#custom-2weeks');
    let custom_30days       = document.querySelector('#custom-30days');
    let custom_thismonth    = document.querySelector('#custom-thismonth');
    let custom_lastmonth    = document.querySelector('#custom-lastmonth');
    let transaction_date    = document.querySelectorAll('.transaction-date');
    var start_at            = document.getElementById('start_at');
    let end_at              = document.getElementById('end_at');
    let date                = new Date();

    for (let mydate of Array.from(transaction_date)) {
        mydate.addEventListener('click',(event)=>{
            transaction_date[0].classList.remove('active');
            switch (event.target.dataset.customdate) {
                case 'yesterday':
                    start_at.value  = getAccurateDate(1,'minus').split("T")[0];
                    end_at.value    = date.toISOString().split("T")[0]
                    transaction_date[0].classList.add('active');
                    transaction_date[1].classList.remove('active');
                    transaction_date[2].classList.remove('active');
                    transaction_date[3].classList.remove('active');
                    transaction_date[4].classList.remove('active');
                    transaction_date[5].classList.remove('active');

                    // alert(event.target.dataset.customdate);
                    // alert(end_at.value);
                    break;
                case'last7days':
                    start_at.value  = getAccurateDate(7,'minus').split("T")[0];
                    end_at.value    = date.toISOString().split("T")[0]                 
                    event.target.classList.add('active');
                    transaction_date[0].classList.remove('active');
                    transaction_date[2].classList.remove('active');
                    transaction_date[3].classList.remove('active');
                    transaction_date[4].classList.remove('active');
                    transaction_date[5].classList.remove('active');
                    
                    break;
                case'last2weeks':
                    start_at.value  = getAccurateDate(14,'minus').split("T")[0];
                    end_at.value    = date.toISOString().split("T")[0]
                    event.target.classList.add('active');
                    transaction_date[0].classList.remove('active');
                    transaction_date[1].classList.remove('active');
                    transaction_date[3].classList.remove('active');
                    transaction_date[4].classList.remove('active');
                    transaction_date[5].classList.remove('active');
                    // alert(end_at.value);
                    break;
                case'last30days':
                    start_at.value  = getAccurateDate(30,'minus').split("T")[0];
                    end_at.value    = date.toISOString().split("T")[0]
                    event.target.classList.add('active');
                    transaction_date[0].classList.remove('active');
                    transaction_date[1].classList.remove('active');
                    transaction_date[2].classList.remove('active');
                    transaction_date[4].classList.remove('active');
                    transaction_date[5].classList.remove('active');
                    // alert(end_at.value);
                    break;
                case'thismonth':                    
                    start_at.value  =date.getFullYear()+'-'+date.toISOString().split('-')[1]+'-'+'01';
                    end_at.value    = date.toISOString().split("T")[0]
                    event.target.classList.add('active');
                    transaction_date[0].classList.remove('active');
                    transaction_date[2].classList.remove('active');
                    transaction_date[3].classList.remove('active');
                    transaction_date[1].classList.remove('active');
                    transaction_date[5].classList.remove('active');
                    // alert(date.getFullYear()+'-'+date.toISOString().split('-')[1]+'-'+'01');
                    break;
                case'lastmonth':
                    start_at.value  = lastmonth().start_date;
                    end_at.value    = lastmonth().end_date
                    event.target.classList.add('active');
                    transaction_date[0].classList.remove('active');
                    transaction_date[2].classList.remove('active');
                    transaction_date[3].classList.remove('active');
                    transaction_date[4].classList.remove('active');
                    transaction_date[1].classList.remove('active');
                    // alert(lastmonth().start_date);
                    break;
                default:
                    alert('select date');
                    break;
            }
        });
        
    }


    let get_transactions = document.getElementById('get_transactions');

    if (get_transactions) {
        get_transactions.addEventListener('click',(event)=>{
            let personal_account = document.getElementById('personal_account');
            let start_at = document.getElementById('start_at');
            let end_at = document.getElementById('end_at');
            let type = document.getElementById('type');
            let feedback = document.getElementById('feedback')
            
            if (start_at.value=="") {
                start_at.style.border ="1px solid red";
                return true;
            }
            if (start_at.value != "") {
                start_at.style.border ="";        
            }
            if (end_at.value=="") {
                end_at.style.border ="1px solid red";
                return true;
            }
            if (end_at.value != "") {
                end_at.style.border ="";        
            }
            paramsTransaction = {
                token:token,
                start_at:start_at.value,
                end_at:end_at.value,
                type:type.value,
                personal_account:personal_account.value
            }
            console.log(paramsTransaction)
            get_transactions.innerHTML=`<i class='bx bx-sync bx-spin bx-sm align-middle'></i> Get record`;
            axios.post("/financials/saveTransactions", paramsTransaction)
            .then(function (response) {
                get_transactions.innerHTML=`<span class='bx bx-sync bx-spin text-success bx-sm align-middle'></span>`;
                const req = response.data;
                console.log(req);
                if(req.error == false){ 
                    get_transactions.innerHTML=`Get record `;
                    toastr.info(req.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
         
                    window.location.href="/financials/account/"+req.transaction;
                }
    
                else{    
                    get_transactions.innerHTML=`Get rocord`;     
                    toastr.info(req.message, 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                }
            })
            .catch(function (error) {
                get_transactions.innerHTML=`Get record`;
                console.log(error);
                toastr.error('Something went wrong', 'Financials', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            });
    
        }); 
    }
 

});





