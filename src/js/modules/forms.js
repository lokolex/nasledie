import { postData } from "../services/services";
import { showModal } from "./modal";
import { closeModal } from "./modal";
import spinner from "../../img/spinner.svg";

const forms = (formSelector, modalTimerId) => {
  const forms = document.querySelectorAll(formSelector);
  const message = {
    loading: spinner,
    success: 'Спасибо! Мы скоро с Вами свяжемся!',
    failure: 'Что-то пошло не так...'
  };

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);

    showModal('.modal', modalTimerId);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal('.modal');
    }, 2000);
  }

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData));

      const inputs = form.querySelectorAll('input[name="name"]');

      postData('assets/sendToTelegram.php', json)
        .then(data => {
          statusMessage.remove();
          if (data.ok) {
            showThanksModal(message.success);
          } else {
            showThanksModal(message.failure);
          }
        })
        .catch(() => {
          statusMessage.remove();
          showThanksModal(message.failure);
        })
        .finally(() => {
          statusMessage.remove();
          inputs.forEach(input => input.value = '');
        });
    });
  }

  forms.forEach(form => {
    bindPostData(form);
  });

}

export default forms;