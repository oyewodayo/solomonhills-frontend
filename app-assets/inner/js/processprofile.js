(function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        const img           = document.querySelector('.profile-image');
        const message       = document.querySelector('#message');
        const photo_burst   = document.querySelector('#photo-burst');
        const new_upload    = document.querySelector('#new-upload');
        var _token          = document.querySelector('input[name="_token"]').value;

        photo_burst.classList.add("bx-radio-circle-marked","bx-burst");

        if (this.files && this.files[0]) {
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
    
            img.src = URL.createObjectURL(this.files[0]); // set src to blob url
            message.innerHTML = `<small style="margin-left:5px"><i class="bx-loader bx-spin  align-middle" ></i> Image processing...</small>`;
        }
        
        const { files } = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append("photo", files[0]);
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        axios.post('/profile/update-photo', formData, config)
        .then(function (response) {
            const data = response.data;
            if (data.error == false || data.error == "false") {
                new_upload.innerHTML = " Photo uploaded ";
                photo_burst.classList.remove("bx-radio-circle-marked","bx-burst");
                toastr.success(data.data, 'Profile', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
    
                message.innerHTML = `<small style="margin-left:5px"><i class="bx bx-check-double align-middle" ></i>${data.data}</small>`;
                setTimeout(()=>{
                    // Clear message
                    message.innerHTML = "";
                },5000);
            } else {
                photo_burst.classList.remove("bx-radio-circle-marked","bx-burst");               
            }
        })
        .catch(function(error){
            photo_burst.classList.remove("bx-radio-circle-marked","bx-burst"); 
            message.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Something went wrong <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        });
    });
})();