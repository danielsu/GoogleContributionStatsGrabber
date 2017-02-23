/*
Google FotoBox Contributer Stats

.section-photo-bucket-content		(one place, with title and multiple photos)
	.section-photo-bucket-title			(Name)
	.section-photo-bucket-subtitle	(Adresse)
	.section-photo-bucket-photos		(Mehrere Fotos möglich)
		.section-photo-bucket-photo-container
		.maps-sprite-photos-view-count		(Anzahl der Views)
*/		
		
		
(function grabStats(){
    var grabBox = document.createElement('div');    
//     var extractButton = document.createElement('button');
    var closeButton = document.createElement('button');
    var countVisibleItemsText = document.createElement('div');
    var countExtractedItemsText = document.createElement('div');
    
    grabBox.setAttribute('style','position: absolute; top: 10px; left: 260px; background:rgba(175, 175, 175, 0.9); padding: 0.5em;     box-shadow: 5px 5px 20px #6f6f6f;');
    grabBox.setAttribute('id','grabBox');

//     extractButton.setAttribute('style','    height: 2em;    width: 2em;    position: absolute;   top: 0;    right: 6em;');
//     extractButton.innerHTML='refresh';
//     extractButton.addEventListener('click',function(){extractData();});
//     grabBox.append(extractButton);

    closeButton.setAttribute('style','    height: 2em;    width: 2em;    position: absolute;   top: 0;    right: 0;');
    closeButton.innerHTML='X';
    closeButton.addEventListener('click',function(){document.body.removeChild(grabBox)});
    grabBox.append(closeButton);

    countVisibleItemsText.setAttribute('style','    height: 2em;    display: inline-block;');
    grabBox.append(countVisibleItemsText);

    countExtractedItemsText.setAttribute('style','    height: 2em;    display: inline-block; margin-left: 2em');
    grabBox.append(countExtractedItemsText);

    var resultBox = document.createElement('textarea');
	resultBox.setAttribute('style','width: 900px;  height: 200px;  display:block; border-top: 1px solid black;');
	resultBox.setAttribute('id','resultBox');
	grabBox.append(resultBox);

	extractData(); // execute once at start

	document.querySelector('.section-scrollbox').addEventListener('DOMSubtreeModified',function(propname, oldValue, newValue){extractData()},false);

	//final step: append box to DOM
	document.body.append(grabBox);

    function extractData(){   

	    var resultArray = [];
	    resultArray.push('title\taddress\tviews');

        var photoList = document.querySelectorAll('.section-photo-bucket-content');
        countVisibleItemsText.innerHTML= '<b>' + photoList.length + '</b> sichtbar';


        photoList.forEach(function(entry){
            var title = entry.querySelector('.section-photo-bucket-title span').innerHTML;
            var address = entry.querySelector('.section-photo-bucket-subtitle span').innerHTML;
            var viewCountFirstItem = entry.querySelector('.maps-sprite-photos-view-count span'); //todo: selectALL need testdata, check if span exists
            //var viewCountList = entry.querySelector('.maps-sprite-photos-view-count span').innerHTML; //todo: selectALL need testdata, check if span exists

            //object vs tab separated
            //resultArray.push({
            //title: title,
            //address: address,
            ////viewCountList: viewCountList.join(' / ');
            //});

            //resultArray.push(title + '\t' + address + (viewCountList ? viewCountList.join(' / '): 'n/a'));
            resultArray.push(title + '\t' + address  + '\t' +  (viewCountFirstItem ? viewCountFirstItem.innerHTML: 'n/a'));
        });

        countExtractedItemsText.innerHTML= '<b>' + (resultArray.length -1) + '</b> extrahiert    (Fotoliste scrollen aktualisiert hier automatisch)'; // substract header lin
        resultBox.value=resultArray.join('\n'); //respects break lines

	}
})();