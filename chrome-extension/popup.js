console.log('envoi du message get current state');
chrome.runtime.sendMessage({ type: 'GET_CURRENT_STATE' }, function (response) {
  const div = document.getElementById('stateInfo');
  console.log({ response });
  if (response && response.data) {
    div.innerHTML = '';
    div.appendChild(createTreeElement(response.data));
  } else {
    div.textContent = 'Error: bad format data';
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'UPDATE_UI') {
    const div = document.getElementById('stateInfo');
    div.innerHTML = '';
    div.appendChild(createTreeElement(request.data));
  }
});

function createTreeElement(obj) {
  const ul = document.createElement('ul');
  for (const key in obj) {
    const li = document.createElement('li');
    const keySpan = document.createElement('span');
    keySpan.textContent = `${key}: `;
    keySpan.className = 'key';
    li.appendChild(keySpan);
    ul.appendChild(li);
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      li.classList.add('has-children');
      li.classList.add('expanded');
      const valueUl = createTreeElement(obj[key]);
      li.appendChild(valueUl);
    } else {
      const valueSpan = document.createElement('span');
      valueSpan.textContent = `${obj[key]}`;
      valueSpan.className = 'value';
      li.appendChild(valueSpan);
    }
    li.addEventListener('click', function (event) {
      event.stopPropagation();
      const childUl = li.querySelector('ul');
      if (childUl) {
        childUl.style.display = childUl.style.display === 'none' ? '' : 'none';
        if (childUl.style.display === 'none') {
          li.classList.remove('expanded');
        } else {
          li.classList.add('expanded');
        }
      }
    });
  }
  return ul;
}
