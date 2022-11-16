import IMask from 'imask';

const phoneInput = function() {

  var phoneInputs = document.querySelectorAll('input[data-tel-input]');
  var maskOptions = {
    mask: '+{7}(000)000-00-00',
    lazy: false,
    signed: true
  };

  phoneInputs.forEach(input => {
    var phoneMask = IMask(input, maskOptions);
    phoneMask.updateValue();
  });
  
};

export default phoneInput;