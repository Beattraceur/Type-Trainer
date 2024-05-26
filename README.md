<h1>TypeTrainer</h1>
<h3>Intro:</h3>
<p>TypeTrainer is a training program for learning fluid 10-finger keyboard typing.<br>
It is written in vanilla JavaScript with CSS styling.</p>
<p>Due to the program's nature, every part and menu is controlled by key input only.<br>
The main idea is to leave the mouse and trackpad aside and stay focused on keyboard writing.</p>
<h3>Structure:</h3>
<p>Once you enter, TypeTrainer tells you to type "day" or "night" depending on your preferred display theme.<br>
When you stop typing midword, you can discover the dynamic select feature, which can be found in every menu.</p>
<img src="https://github.com/Beattraceur/Type-Trainer/assets/133157674/1edcb1f3-2e5b-4ef3-9549-f3c4381c4331" alt="day and night select" width="500">
<h4>Dynamic select feature:</h4>
<p>Say for instance you have already typed the letters "<b>n</b>", "<b>i</b>" and "<b>g</b>" from the selected word "<b>nig</b>ht",<br>
but you want to switch to "day" instead. You can perform this switch simply by pressing "<b>d</b>" in that case.</p>
<p>Once you press the first letter of another select option, you will leave the current word and jump to the other instead.<br>
This will allow you to change your selection at any given time.</p>
<h4>The main menu:</h4>
<img src="https://github.com/Beattraceur/Type-Trainer/assets/133157674/691a5826-9471-4ca0-9dd2-cfbb6120d139" alt="main menu" width="500">
<p>In the main menu, you can create a local account by typing "profile" or type "change" to enter settings.<br>
By typing "mission" you will enter the main training area of TypeTrainer.<br>
Here you can choose a difficulty level and start a training mission.<br>
You can always return to the main menu by pressing the "Esc" button on your keyboard.</p>
<h4>Type Mission:</h4>
<img src="https://github.com/Beattraceur/Type-Trainer/assets/133157674/cc756beb-6b32-4e11-9020-4831f99b5989" alt="type mission" width="500">
<p>In every mission, you have the chance to discover a randomly selected ASCII-Creature, depending on your selected level.<br>
Once you have seen this creature, it will be displayed on your personal profile page.<br>
Maybe you can collect these creatures after a successful run as a reward in the future.<br>
For now, you will just see an analytics graph in addition to your type-speed and accuracy after each session.<br>
If you are logged in with your local account, each run will be saved to your browser's local storage.</p>
<h3>Features:</h3>
<p>In local storage, you can set up <b>multiple accounts</b> that can be managed within the profile page.</p>
<p>When TypeTrainer is opened with Chrome browser, you can install it as a <b>local PWA application.</b></p>
<p>In Settings (typed "change" in the main menu) you can switch between <b>different keyboard layouts</b> like "macDE" or "macUS".<br>
These layouts are <b>stored in JSON format</b> in the project's data folder. Feel free to edit these JSONs or include new layouts as you like.</p>
<p>The available letters for every level are stored in the typeLevel.json file right next to the layout JSONs.<br>
This file can be configured to your needs as well.<br>
Every time the client/player starts a mission, a randomized array of these letters is created.<br>
Each letter is repeated three times for muscle memorization.<br>
To <b>avoid unnecessary calculation</b> while in the type mission, both the <b>typing array</b> and the keyNr-array are <b>created beforehand.</b><br>
Every time the user hits the right letter, it is simply pushed out of both arrays.<br>
The keyNr-array is used to highlight the following key on the virtual keyboard for visual guidance.</p>
<p>For analytics, an error array is created which holds the time delay between each successful hit as well as the false key hits.<br>
Later these arrays can be used to calculate common mistakes. For now, it is just used to calculate the accuracy and type speed.</p>
<p>If you want to join the development of TypeTrainer, feel free to fork the project and send some pull requests...</p>
