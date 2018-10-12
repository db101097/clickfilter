import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.css']
})
export class ImageuploadComponent implements OnInit {
  url = "";
  temp_url = "";
  original_url = "";
  selectedFile = File;
  items: any;
  formData = new FormData();
  constructor(private http: HttpClient, private _sanitizer: DomSanitizer) { }

  ngOnInit() {
  }


  onSelectFile(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0];
      this.selectedFile = file;
      reader.readAsDataURL(file); 

      reader.onload = (event) => {
        this.url = event.target.result;
        this.original_url = event.target.result;
        //console.log(this.url)
        this.formData.set('img', this.url)
      }
    }
  }

  mDown() {
    this.temp_url = this.url
    this.url = this.original_url
    console.log("mouse down event")
  }

  mUp(){
    this.url = this.temp_url
    console.log("mouse up event")
  }

  onSubmit(event) {
    if(this.url == "") {
      alert("No image provided")
    }
    else {
      var value = event.target.value;
      console.log("value:", value)
      //http://localhost:5000/hey

      this.formData.set('value', value);
      this.http.post('http://localhost:5000/hey', this.formData, {responseType: 'blob'})
      .subscribe(res => {
        //console.log(JSON.stringify(res));
        //let res = JSON.stringify(res)
        //console.log(res[1].post_img)
        let reader = new FileReader();
        reader.readAsDataURL(res)
        reader.onload = (event) => {
          this.url = event.target.result;
        }
      })
    }
  }


}
