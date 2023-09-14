let change_default = document.querySelectorAll('input[name="default_card"]');

if (change_default) {
    change_default.forEach(card => {
        card.addEventListener('change',()=>{
            axios.post('/account/debitcard/change-default',{default_card:card.value})
            .then(function(response){
                req =response.data
                toastr.info(req.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                setTimeout(function() {
                window.location.reload();
                }, 1000);
            })
            .catch(function(error){
                toastr.info(error, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    
            })
        });
    });    
}


var cardAmount = document.querySelector('#add-debitcard');

if(cardAmount){
    cardAmount.addEventListener('click', ()=>{
        payWithPayStack();
    });
}


function payWithPayStack(){
    var amount             = cardAmount.dataset.amount;
    var add_click          = document.querySelector('#add-click');
    var firstname          = document.querySelector('#add-firstname').value;
    var lastname           = document.querySelector('#add-lastname').value;
    var email              = document.querySelector('#add-email').value;
    var phone              = document.querySelector('#add-phone').value;
    var wallet             = document.querySelector('#add-wallet').value;

    add_click.innerHTML= `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span> Connecting...`;
    var handler = PaystackPop.setup({
        key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
        email: email,
        amount: amount*100,
        currency: 'NGN',
        firstname: firstname,
        lastname: lastname,
        channels: ['card'],
        metadata: {
            name: firstname+' '+lastname,
            wallet: wallet,
            product:'divi'						
    
        },
        callback: function(response){
            queryPassed(amount,response.reference);
        },
        onClose: function(){
        add_click.innerHTML = "Click here to add debitcard";
        toastr.info('Debitcard not added', 'Debitcard', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });

        }
    });
    handler.openIframe();   
}

function queryPassed(amount,reference){
    var _token             = document.querySelector('input[name="_token"]'); 
    var add_click          = document.querySelector('#add-click');

    var params = { 
        _token: _token,
        amount: amount,
        reference:reference,
        remember:true          
    };


    axios.post('/account/transactionVerification', params)
    .then(function (response) {
        const req = response.data;
        // console.log(req.error);
        // console.log(response);

        if(req.error == false || req.error == 'false'){ 
            add_click.innerHTML = "Click here to add debitcard";
            toastr.info(req.message, 'Debitcard', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    
            setTimeout(function() {
                window.location.reload();
            }, 1000);
        }

        else{
            add_click.innerHTML = "Click here to add debitcard";
            toastr.info(req.message, 'Debitcard', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
        }
    })
    .catch(function (error) {
        console.log(error);            
        add_click.innerHTML = "Click here to add debitcard";
        toastr.info('Something went wrong', 'Debitcard', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    });

}