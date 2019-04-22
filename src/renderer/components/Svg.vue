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
  </svg>
</template>

<script>
  export default {
    name: 'cv-svg'
  }
</script>
