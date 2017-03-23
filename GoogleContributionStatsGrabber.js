/*
 * Google Contribution Stats Grabber
 *
 * .section-photo-bucket-content		(one place, with title and multiple photos)
 *     .section-photo-bucket-header
 *        .section-photo-bucket-title			(Name)
 *        .section-photo-bucket-icon (Main photo of area)
 *     .section-photo-bucket-subtitle	(Address)
 *     .section-photo-bucket-photos		(multiple photos possible)
 *        .section-photo-bucket-photo-container
 *        .maps-sprite-photos-view-count		(Number of Views)
 */

// TODO: show number of top-pictures in list
// TODO: make "show ID" optional to increase performance, use checkbox to toggle
// TODO: get new TEST set, as current has only small view counts
// TODO: button to trigger extraction and toggle for auto-extraction on scroll

(function grabStats() {
    var grabBox = document.createElement('div'),
        closeButton = document.createElement('button'),
        countVisibleItemsText = document.createElement('div'),
        countExtractedItemsText = document.createElement('div'),
        countGlobalViewsText = document.createElement('div'),
        resultBox = document.createElement('textarea');

    grabBox.setAttribute('style', 'position: absolute; top: 10px; left: 260px; background:rgba(175, 175, 175, 0.9); padding: 0.5em; box-shadow: 5px 5px 20px #6f6f6f;');
    grabBox.setAttribute('id', 'grabBox');
    closeButton.setAttribute('style', ' height: 2em; width: 2em; position: absolute; top: 0; right: 0;');
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', function () {
        document.body.removeChild(grabBox)
    });

    grabBox.appendChild(closeButton);
    countVisibleItemsText.setAttribute('style', ' height: 2em; display: inline-block;');
    grabBox.appendChild(countVisibleItemsText);
    countExtractedItemsText.setAttribute('style', ' height: 2em; display: inline-block; margin-left: 2em');
    grabBox.appendChild(countExtractedItemsText);
    countGlobalViewsText.setAttribute('style', ' height: 2em; display: inline-block; margin-left: 4em');
    grabBox.appendChild(countGlobalViewsText);

    resultBox.setAttribute('style', 'width: 900px; height: 200px; display:block; border-top: 1px solid black; white-space: nowrap;');
    resultBox.setAttribute('id', 'resultBox');
    grabBox.appendChild(resultBox);

    extractData();
    document.querySelector('.section-scrollbox').addEventListener('DOMSubtreeModified', function () {
        extractData()
    }, false);
    /*final step: append box to DOM*/
    document.body.appendChild(grabBox);

    function isSameImage(mainPhotoCSS, currentPhoto) {
        // main image: background-image:url(//
        //             lh6.googleusercontent.com/-ZOXccXWuppo/WKihlR7uoZI/AAAAAAABppI/iDtXz92-NbQP7KQpmnXhMN6pCtWHEfMpACLIB/w36-h36-p-k-no/)
        // photo list: lh6.googleusercontent.com/-ZOXccXWuppo/WKihlR7uoZI/AAAAAAABpqE/t030Tq2WczokQTAAIFWhrixZEmmfSN9swCLIB/w102-h168-p-k-no/
        //             ^ ................................................^ equal. Suffix IDs and dimensions can be swapped

        if (!currentPhoto) {
            // handle live loading
            return false;
        } else {
            var mainUrlParts = mainPhotoCSS.slice(23).split('/');// trim 'background-image:url(//' and get content between slashes
            var mainUrl = mainUrlParts[0] + '/' + mainUrlParts[1] + '/' + mainUrlParts[2];
            return currentPhoto.src.indexOf(mainUrl) !== -1;
        }
    }

    function getViewCountAsNumber(node){
        // remove decimal dots
        return node ? parseInt(node.innerText.split('.').join(''),10) : undefined;

    }

    function extractData() {
        var globalCount = 0;
        var resultArray = [];
        resultArray.push('title\taddress\tviews\tisMain\tsource');
        var photoList = document.querySelectorAll('.section-photo-bucket-content');
        countVisibleItemsText.innerHTML = '<b>' + photoList.length + '</b> sichtbar';
        photoList.forEach(function (entry) {
            var headerElement = entry.querySelector('.section-photo-bucket-header');
            //main photo is set via div with css background image
            var mainPhotoCssBgUrl = headerElement.querySelector('.section-photo-bucket-icon').getAttribute('style');
            var titleContent = headerElement.querySelector('.section-photo-bucket-title span').innerHTML;
            var addressContent = headerElement.querySelector('.section-photo-bucket-subtitle span').innerHTML;
            var photoList = entry.querySelectorAll('.section-photo-bucket-photo-container');
            var containsMainPhoto = false;

            photoList.forEach(function (photoContainer) {
                var viewCountString = photoContainer.querySelector('.section-photo-bucket-caption-label');
                var viewCount = getViewCountAsNumber(viewCountString);
                var image = photoContainer.querySelector('img');
                var isMainPhoto = isSameImage(mainPhotoCssBgUrl, image);

                containsMainPhoto = containsMainPhoto || isMainPhoto;

                resultArray.push(titleContent + '\t'
                    + addressContent + '\t'
                    + (viewCount || 'n/a') + '\t'
                    + isMainPhoto + '\t' );
               //     + (image ? image.src : 'n/a'));

                globalCount += (viewCount || 0);
            });

            if (containsMainPhoto) {
                headerElement.setAttribute('style', 'background-color:rgba(181, 255, 157, 0.5)');
                headerElement.setAttribute('title', 'ist Hauptfoto');
            }
        });
        countExtractedItemsText.innerHTML = '<b>' + (resultArray.length - 1) + '</b> extrahiert\t';
        countGlobalViewsText.innerHTML = '<b>' + globalCount + '</b> Views insgesamt\t(Fotoliste scrollen aktualisiert hier automatisch)';
        resultBox.value = resultArray.join('\n');
    }
})();