    // ฟังก์ชั่นเพิ่ม input
    function addInput() {
        const inputs = document.getElementById('inputs');
        const newGroup = document.createElement('div');
        newGroup.classList.add('url-group');
        newGroup.innerHTML = '<input type="text" placeholder="Enter URL" />';
        inputs.appendChild(newGroup);
      }
      // ฟังก์ชั่นลบ input
      function removeInput() {
        const inputs = document.getElementById('inputs');
        if (inputs.children.length > 1) {
          inputs.removeChild(inputs.lastChild);
        }
      }
      // ฟังก์ชั่นสร้าง qrcode
      async function generateQRCodes() {
        const zip = new JSZip();
        const inputs = document.querySelectorAll('.url-group input');
  
        for (let i = 0; i < inputs.length; i++) {
          const url = inputs[i].value.trim();
          if (url) {
            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, url, { width: 300 });
            const dataUrl = canvas.toDataURL('image/png');
  
            // Convert base64 to binary
            const byteString = atob(dataUrl.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let j = 0; j < byteString.length; j++) {
              ia[j] = byteString.charCodeAt(j);
            }
            zip.file(`qr_${i + 1}.png`, ab);
          }
        }
  
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const filename = `WAGQR-${year}-${month}-${day}-${hours}${minutes}${seconds}.rar`;
  
        const content = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
      }