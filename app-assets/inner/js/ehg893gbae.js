window.addEventListener('DOMContentLoaded', function () {
    var amount          = document.querySelector('.account_amount');
    var transferMethod = document.querySelector('.destination');
    var send_fund = document.querySelector('.send_fund');

    if (amount) {
        amount.addEventListener('keyup',()=>{ 
            // /[^0-9.]/g
            var newamount = amount.value.replaceAll(/[-e]/g,'');
            amount.value = newamount; 
               
        }); 
    }
    if (transferMethod) {
        transferMethod.addEventListener('change', function () {
        switch (transferMethod.value) {
            case "add:bank":
            window.location="/profile/bank";
                break;
            case "add:bucket":
            window.location="/bucket/create";
                break;

            default:
       
                break;
        }
    });
    }
 


    if (send_fund) {
        send_fund.addEventListener('click', async ()=>{
            var feedback        = document.querySelector('#feedback');
            var _token          = document.querySelector('input[name="_token"]');

            send_fund.disabled = true;
            send_fund.innerHTML = `<span class='bx bx-radio-circle align-middle font-small-4 bx-burst bx-sm'></span> Processing... `;

            var data = {
                token: _token.value,
                transfer_method: transferMethod.value,
                amount: amount.value
            };

            await fetch('/account/post/transfer', {
                method:"POST",
                mode:"cors",
                cache:"no-cache",
                credentials:"same-origin",
                headers:{
                    "Content-Type":"application/json",
                    'X-CSRF-TOKEN':_token.value,
                },
                body: JSON.stringify(data)
            })
            .then((response)=>response.json())
            .then(response=>{                        
                if (response.error == false || response.error == "false") {
                    document.querySelector('.account_amount').innerHTML = "";
                    send_fund.innerHTML = ` Send `;
                    toastr.info(response.message, 'Transfer', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    send_fund.disabled = false;
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
                else {
                    send_fund.innerHTML = ` Send `;
                    toastr.info(response.message, 'Transfer', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                    send_fund.disabled = false;
                }
            })
            .catch((error)=>{
                send_fund.innerHTML=` Send `;
                send_fund.disabled = false;
                // console.log(error);
                toastr.error('Something went wrong', 'Transfer', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
            })
        }); 
    }
});