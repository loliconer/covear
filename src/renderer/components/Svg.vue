<template>
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
    <symbol id="icon-cv-task" viewBox="0 0 24 24">
      <path fill="currentColor" d="M14,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h13c0.6,0,1,0.4,1,1S14.6,13,14,13z"></path>
      <path fill="currentColor" d="M23,6H1C0.4,6,0,5.6,0,5s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,6,23,6z"></path>
      <path fill="currentColor" d="M23,20H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h22c0.6,0,1,0.4,1,1S23.6,20,23,20z"></path>
    </symbol>

    <symbol id="icon-cv-add" viewBox="0 0 24 24">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <line fill="none" stroke="#fff" stroke-miterlimit="10" x1="12" y1="2" x2="12" y2="22"/>
        <line fill="none" stroke="#fff" stroke-miterlimit="10" x1="22" y1="12" x2="2" y2="12"/>
      </g>
    </symbol>

    <symbol id="icon-cv-preference" viewBox="0 0 24 24">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <line fill="none" stroke-miterlimit="10" x1="14" y1="4" x2="23" y2="4"/>
        <line fill="none" stroke-miterlimit="10" x1="1" y1="4" x2="4" y2="4"/>
        <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="22" y1="12" x2="23" y2="12"/>
        <line data-color="color-2" fill="none" stroke-miterlimit="10" x1="1" y1="12" x2="12" y2="12"/>
        <line fill="none" stroke-miterlimit="10" x1="14" y1="20" x2="23" y2="20"/>
        <line fill="none" stroke-miterlimit="10" x1="1" y1="20" x2="4" y2="20"/>
        <circle fill="none" stroke-miterlimit="10" cx="7" cy="4" r="3"/>
        <circle data-color="color-2" fill="none" stroke-miterlimit="10" cx="15" cy="12" r="3"/>
        <circle fill="none" stroke-miterlimit="10" cx="7" cy="20" r="3"/>
      </g>
    </symbol>

    <symbol id="icon-cv-about" viewBox="0 0 24 24">
      <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="#fff" stroke="#fff">
        <circle fill="none" stroke="#fff" stroke-miterlimit="10" cx="12" cy="12" r="11"/>
        <path data-color="color-2" fill="none" stroke-miterlimit="10" d="M12,15v-2 c1.609,0,3-1.391,3-3s-1.391-3-3-3c-1.194,0-2.342,0.893-2.792,1.921"/>
        <circle data-color="color-2" data-stroke="none" cx="12" cy="18" r="1" stroke-linejoin="miter" stroke-linecap="square" stroke="none"/>
      </g>
    </symbol>

    <symbol id="icon-cv-basic" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6.5,11h11c3,0,5.5-2.5,5.5-5.5S20.5,0,17.5,0h-11C3.5,0,1,2.5,1,5.5S3.5,11,6.5,11z M6.5,2 C8.4,2,10,3.6,10,5.5S8.4,9,6.5,9S3,7.4,3,5.5S4.6,2,6.5,2z"></path>
      <path fill="currentColor" d="M17.5,13h-11c-3,0-5.5,2.5-5.5,5.5S3.5,24,6.5,24h11c3,0,5.5-2.5,5.5-5.5S20.5,13,17.5,13z M17.5,22c-1.9,0-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5s3.5,1.6,3.5,3.5S19.4,22,17.5,22z"></path>
    </symbol>

    <symbol id="icon-cv-advanced" viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.94,13.94C18.631,13.976,18.318,14,18,14c-0.305,0-0.608-0.018-0.912-0.053l-3.641,4.499 l4.518,4.518c1.381,1.381,3.619,1.381,5,0v0c1.381-1.381,1.381-3.619,0-5L18.94,13.94z"></path>
      <path fill="currentColor" d="M20.271,6.771l-3.042-3.042l3.208-3.208C19.692,0.189,18.869,0,18,0c-3.314,0-6,2.686-6,6 c0,0.594,0.089,1.166,0.25,1.708l-10.789,8.73c-0.891,0.787-1.423,1.919-1.459,3.106c-0.037,1.188,0.424,2.351,1.264,3.19 C2.082,23.551,3.167,24,4.321,24c1.239,0,2.421-0.532,3.241-1.461l8.73-10.789C16.834,11.911,17.406,12,18,12c3.314,0,6-2.686,6-6 c0-0.869-0.189-1.692-0.521-2.438L20.271,6.771z"></path>
      <polygon points="10.853,9.439 6.707,5.293 8,4 4,0 0,4 4,8 5.293,6.707 9.189,10.603"></polygon>
    </symbol>

    <symbol id="icon-cv-start" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20.555,11.168l-15-10c-0.307-0.204-0.702-0.224-1.026-0.05C4.203,1.292,4,1.631,4,2v20 c0,0.369,0.203,0.708,0.528,0.882C4.676,22.961,4.838,23,5,23c0.194,0,0.388-0.057,0.555-0.168l15-10C20.833,12.646,21,12.334,21,12 S20.833,11.354,20.555,11.168z"></path>
    </symbol>

    <symbol id="icon-cv-stop" viewBox="0 0 24 24">
      <path fill="currentColor" d="M22,1H2C1.447,1,1,1.447,1,2v20c0,0.553,0.447,1,1,1h20c0.553,0,1-0.447,1-1V2C23,1.447,22.553,1,22,1z"></path>
    </symbol>

    <symbol id="icon-cv-pause" viewBox="0 0 24 24">
      <path fill="currentColor" d="M9,1H3C2.447,1,2,1.447,2,2v20c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1V2C10,1.447,9.553,1,9,1z"></path>
      <path fill="currentColor" d="M21,1h-6c-0.553,0-1,0.447-1,1v20c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1V2C22,1.447,21.553,1,21,1z"></path>
    </symbol>

    <symbol id="icon-cv-refresh" viewBox="0 0 24 24">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path fill="none" stroke-miterlimit="10" d="M22,12c0,5.5-4.5,10-10,10 S2,17.5,2,12S6.5,2,12,2c3.9,0,7.3,2.2,8.9,5.5"></path>
        <polyline fill="none" stroke-miterlimit="10" points="21.8,1.7 21,7.6 15,6.8 "/>
      </g>
    </symbol>
    <symbol id="icon-cv-start-line" viewBox="0 0 24 24">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <polygon fill="none" stroke-miterlimit="10" points="5,22 5,2 20,12 "/>
      </g>
    </symbol>
    <symbol id="icon-cv-pause-line" viewBox="0 0 24 24">
      <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <rect x="3" y="2" fill="none" stroke-miterlimit="10" width="6" height="20"/>
        <rect x="15" y="2" fill="none" stroke-miterlimit="10" width="6" height="20"/>
      </g>
    </symbol>
  </svg>
</template>

<script>
  export default {
    name: 'cv-svg'
  }
</script>
