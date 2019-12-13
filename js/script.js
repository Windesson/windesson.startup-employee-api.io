const employeeURL = 'https://randomuser.me/api/?results=12&nat=us'; 
const $gallery = $('.gallery')
const $searchContainer = $('.search-container');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log(error))
}

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function generateSearch(){
    const $searchForm = $(`                        
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form> `);

    $searchForm.on('submit', (event) => {
        event.preventDefault();
        $('.card').each( function(){
            const searchInput = $('#search-input').val().toLowerCase();
            const currName = $(this).find('#name').text().toLowerCase();

            if(searchInput === '' || currName.includes(searchInput)) { 
                $(this).show();                
            } else {
                $(this).hide();
            }

            $('#search-message').remove();
            if($('.card').length === $('.card[style*="display: none"]').length){
                $('body').append('<span id="search-message">Sorry... no matching employees found!<span>')
            } 
        });
    });

    $searchContainer.append($searchForm);

}

function generateGallery(data){
    data.results.map( person => {
        const $card = $(`
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${person.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
        </div>
        `);

        $card.click(() => generateModel($card,person));
        $gallery.append($card);
    });
}

function generateModel($card, person){
    const date = new Date(person.dob.date);
    const birthday = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
    const $model = $(`
        <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.phone}</p>
                <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city} ${person.location.state}</p>
                <p class="modal-text">Birthday: ${birthday}</p>
            </div>
        </div>
        
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
        </div>
    `);

    $('body').append($model);
    $('#modal-close-btn').click(() => {
        $('.modal-container').remove()
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 27) $('.modal-container').remove() // esc
      });
    
    $('#modal-next').click(() => {
        $('.modal-container').remove();
        var $currCard = $card;
        do{
            $currCard = $currCard.next();
        }while($currCard.is(":hidden") || !$currCard);
        
        $currCard.click();
    });

    $('#modal-prev').click(() => {
        $('.modal-container').remove();
        var $currCard = $card;
        do{
            $currCard = $currCard.prev();
        }while($currCard.is(":hidden") || !$currCard);
        
        $currCard.click();
    });

}

function checkStatus(response) {
    if(response.ok){
        return Promise.resolve(response);
    } else {
        return Promise.reject( new Error(response.statusText));
    }
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    fetchData(employeeURL)
    .then(generateGallery)
    .then(generateSearch);
});