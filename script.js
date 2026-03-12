const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const downloadLink = document.getElementById("downloadLink");

let imageFile;

qualitySlider.oninput = () => {
    qualityValue.innerText = qualitySlider.value;
};

upload.onchange = (e) => {

    imageFile = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function(event){
        preview.src = event.target.result;
    };

    reader.readAsDataURL(imageFile);
};

function compressImage(){

    if(!imageFile){
        alert("Please upload an image first.");
        return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = preview.src;

    img.onload = function(){

        const maxWidth = 1920;

        if(img.width > maxWidth){
            canvas.width = maxWidth;
            canvas.height = img.height * (maxWidth / img.width);
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.drawImage(img,0,0,canvas.width,canvas.height);

        let outputType = imageFile.type;

        if(imageFile.type === "image/png"){
            outputType = "image/jpeg";
        }

        canvas.toBlob(function(blob){

            const url = URL.createObjectURL(blob);

            downloadLink.href = url;
            downloadLink.download = "compressed-" + imageFile.name;
            downloadLink.innerText = "Download Image";
            downloadLink.style.display = "block";

        }, outputType, qualitySlider.value);

    };
}
