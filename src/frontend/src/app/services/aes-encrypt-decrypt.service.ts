import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' }) export class AESEncryptDecryptService {
  /**
   * `encryption`
   * encryption key details
   */
  encryption = {
    key: environment.encryptionKey,
  };

  /**
   * `encryptString`
   * encrypt string value
   * @param value
   * @returns encrypted string
   */
  encryptString(value: string): string {
    return CryptoJS.AES.encrypt(value, this.encryption.key.trim()).toString();
  }

  /**
   * `decryptString`
   * decrypt string value
   * @param value
   * @returns decrypted string
   */
  decryptString(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.encryption.key.trim()).toString(CryptoJS.enc.Utf8);
  }

  /**
   * `encryptObj`
   * encrypt object
   * @param data
   * @returns encrypted object
   */
  encryptObj(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryption.key.trim()).toString();
  }

  /**
  * `decryptObj`
  * decrypt object
  * @param data
  * @returns decrypted object
  */
  decryptObj(data) {
    const bytes = CryptoJS.AES.decrypt(data, this.encryption.key.trim());
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
