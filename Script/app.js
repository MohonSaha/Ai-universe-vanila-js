const showMoreBtn = document.getElementById('show-more').classList.add('d-none');
let allData = [];


const fetchData = () => {
    document.getElementById('spinner-container').classList.remove('d-none')
    const URL = 'https://openapi.programming-hero.com/api/ai/tools';
    fetch(URL)
        .then(res => res.json())
        .then(data => {
            const showMoreBtn = document.getElementById('show-more').classList.remove('d-none');
            document.getElementById('spinner-container').classList.add('d-none')
            allData = data.data.tools;
            displayFetchData(allData.slice(0, 6))
        })
};


const displayFetchData = (data) => {
    let presentDataLength = data.length;
    const cardParent = document.getElementById('card-container');
    data.forEach(singleData => {
        const { image, features, name, published_in, id } = singleData;
        
        const btnContainer = document.getElementById('btn-container');
        btnContainer.innerHTML = `
                <button onclick="sortByDate(${presentDataLength})" type="button" class="btn btn-danger mt-3">Sort By Date</button>
        `;

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col');
        cardDiv.innerHTML = `
                <div class="card h-100 p-3">
                    <img src="${image}" class="card-img-top rounded card-img" alt="">
                    <div class="card-body">
                        <h5 class="card-title">Features</h5>
                        <p class="card-text">

                        <ol>
                            ${features.map((s) => `<li>${s}</li>`).join('')}
                        </ol>

                        <hr class = 'mb-4'> 
                            <div class='d-flex align-items-center justify-content-between'>
                                <div>
                                    <h5 class="card-title">${name}</h5>
                                    <div class='date-container d-flex align-items-center'> 
                                         <i class="fa-solid fa-calendar-days me-2"></i>
                                        <p class='publish-date'>${published_in}</p>
                                    </div>
                                </div>
                                <i onclick="fetchShowDetails('${id}')" class="fa-solid fa-arrow-right" data-bs-toggle="modal" data-bs-target="#aiPage"></i>
                            </div>
                            </p>
                    </div>
                </div>
        `;

        cardParent.appendChild(cardDiv);          

    });
}


// Function: Fetch details data through id
const fetchShowDetails = (id) => {
    const URL = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    fetch(URL)
        .then(res => res.json())
        .then(data => displayShowDetails(data.data))
}

// Function: Display details through modal: 
const displayShowDetails = (data) => {
    console.log(data);
    const { input_output_examples, image_link, description, pricing, features, integrations, accuracy } = data;
    console.log(pricing);
    // console.log(pricing[1].price)
    const modalImg = document.getElementById('modal-img');
    const modalText = document.getElementById('modal-text');
    modalText.innerHTML = `
                    <div class='modal-text-container'>
                        <h4>${description}</h4>

                        <div class= 'price-container'>
                            <div class = 'basic-price price-div'>
                            <p>${pricing ? priceChecking(pricing[0].price, pricing, 0) : 'Free of Cost'}</p>
                            <p>${pricing ? pricing[0].plan : 'Basic'}</p>
                            </div>

                            <div class = 'pro-price price-div'>
                                <p>${pricing ? priceChecking(pricing[1].price, pricing, 1) : 'Free of Cost'}</p>
                                <p>${pricing ? pricing[1].plan : 'Pro'}</p>
                            </div>

                            <div class = 'enterprise-price price-div'>
                                <p>${pricing ? pricing[2].price : 'Free of Cost'}</p>
                                <p>${pricing ? pricing[2].plan : 'Enterprise'}</p>
                            </div>
                        </div>

                        <div class = 'features-container'>
                            <div class="row">
                                <div class="col-md-6">
                                    <h4>Features</h4>
                                    <ul>
                                        <li>${features[1].feature_name}</li>
                                        <li>${features[2].feature_name}</li>
                                         <li>${features[3].feature_name}</li>
                                    </ul>
                                </div>
                            
                                <div class="col-md-6">
                                    <h4>Integrations</h4>
                                    <ul>
                                        <li>${integrations ? integrations[0] ? integrations[0] : "No data found" : "No data found"}</li>
                                        <li>${integrations ? integrations[1] ? integrations[1] : "No data found" : "No data found"}</li>
                                         <li>${integrations ? integrations[2] ? integrations[2] : "No data found" : "No data found"}</li>
                                    </ul>
                                </div>
                            </div>                            
                        </div>
                    </div>
    `;

    modalImg.innerHTML = `
                    <div class = 'modal-img-container position-relative'>                   
                    <img class='modal-img pe-2' src="${image_link[0]}" alt="">
                        <h5 class="card-title">
                        ${accuracy.score ? `<span class="badge text-bg-danger">${accuracy.score * 100}% Accuracy</span>` : `<span class="badge text-bg-warning d-none">${accuracy.score}</span>`}</h5>
                    
                    <div class = 'text-center mt-4 pe-3'>
                    <h4>${input_output_examples ? input_output_examples[0].input : "Can you give any example?"}</h4>
                    <p class = 'px-4 text-secondary'>${input_output_examples ? input_output_examples[0].output : 'No! Not Yet! Take a break!!!'}</p>
                    </div>
                    </div>
    `;
}


// Price Checking Function
const priceChecking = (price, amount, index) =>{
    if(price === 'No cost'){
        const noCost = "Free of Cost";
        return noCost;
    }
    else if(price === '0'){
        const zeroCost = "Free of Cost";
        return zeroCost;
    }
    else{
        const show = amount[index].price;
        return show;

    }
}


// Function: Implement sort button

const sortByDate = (length) => {
    if (length === 6) {
        const cardParent = document.getElementById('card-container');
        cardParent.innerHTML = '';
        displayFetchData(allData.slice(0, 6).sort(customSort))
    }
    else{
        const cardParent = document.getElementById('card-container');
        cardParent.innerHTML = '';
        displayFetchData(allData.sort(customSort))
    }
}

// Date sorting function :
customSort = (a, b) => {
    const dateA = new Date(a.published_in);
    const dateB = new Date(b.published_in);
    if (dateA > dateB) return 1;
    else if (dateA < dateB) return -1;
    return 0;
};

// Show all button to show all data in UI
const showAllData = () => {
    const cardParent = document.getElementById('card-container');
    cardParent.innerHTML = '';
    displayFetchData(allData)
    const showMoreBtn = document.getElementById('show-more');
    showMoreBtn.classList.add('d-none');

}

fetchData();