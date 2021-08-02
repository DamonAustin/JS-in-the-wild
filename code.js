class FlickerGallery{
    constructor(location){
        this.term = `buildings`;
        this.location = location;
        this.photos = [];
        this.isLoading = false;
        this.isFirstLoad;
        this.container = document.getElementById(`photoContainer`);

        document.getElementById('next').addEventListener('click', this.displayNextPhoto.bind(this));
    }

    generateApiURL() {
        return `https://shrouded-mountain-15003.herokuapp.com/` +
        `https://flickr.com/services/rest/` +
        `?api_key=a276a70de8abef8e0f55d4d74f4f0d53` +
        `&format=json` +
        `&nojsoncallback=1` +
        `&method=flickr.photos.search` +
        `&safe_search=1` +
        `&per_page=5` +
        `&lat=${this.location.latitude}` +
        `&lon=${this.location.longitude}` +
        `&text=${this.term}`
    }
    
    displayNextPhoto() {
        this.currentPhotoIndex += 1

        if (this.currentPhotoIndex < this.photos.length) {
            let photoObject = this.photos[this.currentPhotoIndex];
            this.displayPhotoObject(photoObject);
        } else {
            this.page += 1;
            this.currentPhotoIndex = 0;
            this.fetchDataFromFlickr();
        }
    }

    displayPhotoObject(photoObj) {
        let imageUrl = this.constructImageURL(photoObj);
        let img = document.createElement('img');
        img.src = imageUrl;
        this.container.innerHTML = '';
        this.container.append(img);
    }

    constructImageURL(photoObj) {
        return "https://farm" + photoObj.farm +
                ".staticflickr.com/" + photoObj.server +
                "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }

    processFlickrResponse(parsedResponse) {
        //this.setLoading(false)
        console.log(parsedResponse)
        this.photos = [...this.photos, ...parsedResponse.photos.photo]
        if (this.photos.length > 0) {
            let firstPhotoObject = this.photos[this.currentPhotoIndex]
            if (this.isFirstLoad) {
                this.displayPhotoObject(firstPhotoObject)
                this.isFirstLoad = false
            }
        } else {
            this.container.innerHTML = 'No more pictures'
        }
    }

    fetchDataFromFlickr() {
        let url = this.generateApiURL();
        let fetchPromise = fetch(url);
        //this.setLoading(true);
        fetchPromise
            .then(response => response.json())
            .then(parsedResponse => this.processFlickrResponse(parsedResponse))
    }
}









function onGeolocationSuccess(data) {
    let location = data.coords;
    console.log(location);
    let gallery = new FlickerGallery(location);
    gallery.fetchDataFromFlickr();
}

function onGeolocationError() {
    //Canada
    const defaultLocation = { 
        latitude: 38.7252224,
        longitude: 79.2458
    }
    console.log(defaultLocation);
    let gallery = new FlickerGallery(location);
    gallery.fetchDataFromFlickr();
}



navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);