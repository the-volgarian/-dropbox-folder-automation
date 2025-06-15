import './style.css';
import { Dropbox } from 'dropbox';

const ACCESS_TOKEN = 'sl.u.AFxSMIFl0iQGxN1xm_1sqQ7D78web_JUA-X9PaJZRyKHaMpdvDYF3OSn_l2-yq387seajmFoea1ChasMJab0OPKB5PHtpZBYu9CceEFwoFAI2xGQzZMrBWKRFw3ZWJukiPO8UQ2Oa4cDCU6fSIjE93o4f5Pzf0kD0pyredhNZifJzQ6Ej61Q0NtdJBTo4ExxyyFgBZsm_wHpXoAPv1ZqRvJ597ggFkmKgmtzdQG18yJTx9ZwkwDeI2EO7P9D7IfIyofZgEjqMomN1SdNFg2pRAk1vELcv7qODCqWQ_xISciE-eibtu06k-IOiMdAtWrMUEDEnIGUjw5t9Tk1T9mih1NK2-rh0yFeSwzKziJbFeKE9yFZKmGm6UCmcEyTAAhyfXiAiSGWHFgyXSrG2ij-nBi5trsCi5yceImjwphrLXvCo_jw8Fp4tLlzWNLHN_UePb6B6oyCwa2ATwdHlw32fxFZZQon8AtpcryQYDNjPEmfpX9e8XVsOjbUbt5Cpqw1fTQRilC9H74ujL-KdnY8-XzuA12OXHhWJ2COkSog99rebqtM4ROpj6czvOC6-2RzowvL2yOmEjvm6NHB-dz4rLJzpiN8o3qetB7_AKbSx8EPp8xtHqh3Q8OGP_DenrbqekPd1vyjdkoVldpLK_Rql2QzvMfNhs3oBMHzzkHOZozBKcGrcTiBWwudWa2SCBS5sGsLj-AEP5kJ8atpDvNmdKeiXpW6_9mna_mybvXzUXtXy9Dff-HQ6vHSIjbyiO8f5XhKReln7G-yHi_3NNJfh9JgBe-IptFO8iHbp75qLJmprJyojsr4kHTVa9T3xZI-g19nVoidTRfrtW2Ueml2vVpvjM6Feir8fQdWhfIC587qsaFqzRsSklyM3E-lwV4ZJbf5ZGG_mwuWSoNBhp2GHlCgAcRBSPlX6M9uBaC5p6xAyksPo6_tAkjm6XrEd-y6W61DqIAhSvHDsDvwdz-7bXM8twJRCRn50DBzhpz7xryJOzj8ar5Qb10c2BcOYcBC9-O4lMya1yIUvhgy84FwF8iErc92yu1TVcOLI6BoICADMpCmKLKshGcQC_tPXbMmQvZ0pWvPrGsH7NqSswLsFKJT83d3a4QZtYs64nwsL4-JBzFWfxNvx1ryJPTJ49KBITRU3FiTWp8bKUhofpxXW6EfPTzXFXuHytxFc9J2Uia5bOjqTKbV1g5XV-QbbIIrlu0dO4vM77F32MPP7y4JY_lFdc_vJJ-SDk-TZmFU_Qvxoj-r8y7Ucktz-KOu887QOXDENa2FNurF5etNJmk4-ikOKT8vXeEBbGdk2h6yWJAJGv-GNcqfRk9bsWD9Is61kgQ0vPwqhMIl6ybT9jxIkvEdSZmqeyKOhVhz0kz3bffMbr0xniwiIAsVrF_xEJjXdNUkRjeUbei8Md4wXs0wJKQ6fkuOd0gACIlHYZPA1AwL5QDItw8dIqfGBi0PF5ooyAU'; // същият твой токен
const PRESET_URL   = '/поръчка 5020.pdf';

function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}

const saveBtn  = document.getElementById('save-btn');

if (!ACCESS_TOKEN) {
  showToast('❌ ERROR: липсва токен');
  saveBtn.disabled = true;
  throw new Error('Missing ACCESS_TOKEN');
}

const dbx = new Dropbox({ accessToken: ACCESS_TOKEN });

saveBtn.addEventListener('click', async () => {
  showToast('⏳ Сваляне на PDF…');
  let arrayBuffer;
  try {
    const resp = await fetch(PRESET_URL);
    if (!resp.ok) throw new Error(`Не можах да сваля файла (${resp.status})`);
    arrayBuffer = await resp.arrayBuffer();
  } catch (err) {
    console.error('Fetch error:', err);
    alert(`❌ Грешка при сваляне: ${err.message}`);
    return;
  }

  const contents = new Uint8Array(arrayBuffer);
  const dropboxPath = `/DFD Group/Поръчки/5020 Client 13062025/поръчка 5020.pdf`;

  showToast('⏳ Качване в Dropbox…');

  try {
    await dbx.filesUpload({
      path:            dropboxPath,
      contents,
      mode:            { '.tag': 'overwrite' },
      autorename:      false,
      mute:            false,
      strict_conflict: false
    });
    showToast('✅ Файлът е успешно качен!');
  } catch (err) {
    console.error('Dropbox upload error:', err);
    const summary = err.error?.error_summary || err.toString();
    showToast(`❌ Качването се провали: ${summary}`);
  }
});
