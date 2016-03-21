// 入力ポート
int portInputD0 = 0;
int portInputA0 = A0;
int portInputA1 = A1;
// 出力ポート
int portOutputD1 = 1;
int portOutputD5 = 5;
int portOutputD9 = 9;
// 入力の状態記録
int stateInput1 = LOW;
int stateInput2 = LOW;
int stateInput3 = LOW;
// USBから入ってくる値
int inputUSBByte = 0;
 
void setup() {
  // 出力のピン
  pinMode(portOutputD1, OUTPUT);
  pinMode(portOutputD5, OUTPUT);
  pinMode(portOutputD9, OUTPUT);
  // 入力のピン
  pinMode(portInputD0, INPUT);
  pinMode(portInputA0, INPUT);
  pinMode(portInputA1, INPUT);
   
  Serial.begin(9600);
}
 
void loop() {
  // 入力の状態を取得
  int stateInputCurrent1 = digitalRead(portInputD0);
  int stateInputCurrent2 = digitalRead(portInputA0);
  int stateInputCurrent3 = digitalRead(portInputA1);
  // 入力の値の判定
  if ( (stateInputCurrent1 != stateInput1) && (stateInputCurrent1 == HIGH) ) {
    Serial.println(1);
    delay(100);
  }
   
  if ( (stateInputCurrent2 != stateInput2) && (stateInputCurrent2 == HIGH) ) {
    Serial.println(2);
    delay(100);
  }
   
  if ( (stateInputCurrent3 != stateInput3) && (stateInputCurrent3 == HIGH) ) {
    Serial.println(3);
    delay(100);
  }
  // 入力の状態を次のループまで記憶
  stateInput1 = stateInputCurrent1;
  stateInput2 = stateInputCurrent2;
  stateInput3 = stateInputCurrent3;
  // USBから入ってくる値を監視（1文字）
  if(Serial.available() > 0){
      inputUSBByte = Serial.read();
      if(inputUSBByte == '1'){
        Serial.println("inputUSBByte 1");
        digitalWrite(portOutputD1,HIGH);
        delay(3000);
        digitalWrite(portOutputD1,LOW);
      }
      if(inputUSBByte == '2'){
        Serial.println("inputUSBByte 2");
        digitalWrite(portOutputD5,HIGH);
        delay(3000);
        digitalWrite(portOutputD5,LOW);
      }
      if(inputUSBByte == '3'){
        Serial.println("inputUSBByte 3");
        digitalWrite(portOutputD9,HIGH);
        delay(3000);
        digitalWrite(portOutputD9,LOW);
      }
  }
  // 基礎ループ
  delay(10);
}
