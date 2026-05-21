<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="$emit('closeModal')">
      <div class="modal-container">

        <!-- HEADER — always visible, never scrolls away -->
        <div class="modal-header">
          <slot name="header" />
        </div>

        <!-- BODY — only this part scrolls -->
        <div class="modal-body">
          <slot name="body" />
        </div>

        <!-- FOOTER — always visible at bottom -->
        <div class="modal-footer">
          <slot name="footer" />
        </div>

      </div>
    </div>
  </teleport>
</template>

<script setup>
defineEmits(['closeModal'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;        /* header / body / footer stacked */
  overflow: hidden;              /* clip rounded corners */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.25s ease;
}

/* ── HEADER: fixed height, never scrolls ── */
.modal-header {
  flex-shrink: 0;                /* never collapse */
  padding: 16px 20px;
  border-bottom: 1.5px solid #e5e7eb;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px 16px 0 0;
}

/* ── BODY: flex-grow + scroll ── */
.modal-body {
  flex: 1;
  overflow-y: auto;              /* only body scrolls */
  padding: 20px;
}

/* ── FOOTER: fixed height, never scrolls ── */
.modal-footer {
  flex-shrink: 0;
  padding: 12px 20px;
  border-top: 1.5px solid #e5e7eb;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 0 0 16px 16px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>