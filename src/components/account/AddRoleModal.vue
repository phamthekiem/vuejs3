<template>
  <b-modal 
    v-model="internalShow" 
    title="Create New Role" 
    hide-footer
    centered
    size="lg"
    @hide="resetForm"
  >
    <div>
      <label for="roleName">Name *</label>
      <input type="text" id="roleName" v-model="roleName" />
      
      <div>
        <input type="checkbox" id="fullPermissions" />
        <label for="fullPermissions">Full Permissions</label>
      </div>

      <div>
        <div style="padding-inline-start: 20px;">
          <input type="checkbox" id="identity" />
          <label for="identity">Identity</label>
        </div>
        <div>
          <div style="padding-inline-start: 40px;">
            <input type="checkbox" id="user" />
            <label for="user">User</label>
          </div>
          <div style="padding-inline-start: 60px;">
            <input type="checkbox" id="userRead" />
            <label for="userRead">Read</label>
            <br />
            <input type="checkbox" id="userCreate" />
            <label for="userCreate">Create</label>
            <br />
            <input type="checkbox" id="userUpdate" />
            <label for="userUpdate">Update</label>
            <br />
            <input type="checkbox" id="userDelete" />
            <label for="userDelete">Delete</label>
          </div>
        </div>
        <div>
          <div style="padding-inline-start: 40px;">
            <input type="checkbox" id="role" />
            <label for="role">Role</label>
          </div>
          <div style="padding-inline-start: 60px;">
            <input type="checkbox" id="roleRead" />
            <label for="roleRead">Read</label>
            <br />
            <input type="checkbox" id="roleCreate" />
            <label for="roleCreate">Create</label>
            <br />
            <input type="checkbox" id="roleUpdate" />
            <label for="roleUpdate">Update</label>
            <br />
            <input type="checkbox" id="roleDelete" />
            <label for="roleDelete">Delete</label>
          </div>
        </div>
        <div>
          <div style="padding-inline-start: 40px;">
            <input type="checkbox" id="syslog" />
            <label for="syslog">Syslog</label>
          </div>
          <div style="padding-inline-start: 60px;">
            <input type="checkbox" id="syslogRead" />
            <label for="syslogRead">Read</label>
          </div>
        </div>
      </div>

      <b-button variant="secondary" @click="close">Cancel</b-button>
      <b-button variant="primary" @click="addRole">Submit</b-button>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'AddRoleModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const roleName = ref('');
    const internalShow = ref(props.modelValue);

    watch(() => props.modelValue, (newVal) => {
      internalShow.value = newVal;
    });

    const close = () => {
      emit('update:modelValue', false);
    };

    const addRole = () => {
      if (roleName.value.trim()) {
        console.log('Role added:', roleName.value);
        close();
      } else {
        alert("Role name cannot be empty.");
      }
    };

    const resetForm = () => {
      roleName.value = ''; 
    };

    watch(internalShow, (newVal) => {
      emit('update:modelValue', newVal);
    });

    return { 
      roleName, 
      internalShow,
      close, 
      addRole, 
      resetForm 
    };
  }
});
</script>
