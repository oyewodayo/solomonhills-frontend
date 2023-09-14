const temi = new Temi();

const notify_btn = document.getElementById('notify_btn');
const response = document.getElementById('response');

notify_btn.addEventListener('click', () => {
    const email = document.querySelector('input[name="email"]').value;
    const token = document.querySelector('input[name="_token"]').value;
    notify_btn.innerHTML = "Taking note..."
    temi.postRequest('/notifycomingsoon', {
        token: token,
        email: email,
    }).then(data => {
        console.log(data);
        if (data.error == true) {
            notify_btn.innerHTML = "Notify"
            response.innerHTML = `<div class="alert alert-success mb-2 mt-2 alert-dismissible">
                    ${data.message}
                    <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                    </div>`;
            setTimeout(function() {
                response.innerHTML = ""
            }, 4000);

        }
    }).catch((error) => {
        response.innerHTML = `<div class="alert alert-success mb-2 mt-2 alert-dismissible">
       Error occurred. Please try again
        <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
        </div>`;

        notify_btn.innerHTML = "Notify"
        console.log(error);
        setTimeout(function() {
            response.innerHTML = ""
        }, 4000);
    });
});


var deadline = new Date("Jul 20, 2022 15:37:25").getTime();

var x = setInterval(function() {

    var now = new Date().getTime();
    var t = deadline - now;
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((t % (1000 * 60)) / 1000);
    document.getElementById("day").innerHTML = days;
    document.getElementById("hour").innerHTML = hours;
    document.getElementById("minute").innerHTML = minutes;
    document.getElementById("second").innerHTML = seconds;
    if (t < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "TIME UP";
        document.getElementById("day").innerHTML = '0';
        document.getElementById("hour").innerHTML = '0';
        document.getElementById("minute").innerHTML = '0';
        document.getElementById("second").innerHTML = '0';
    }
}, 1000);