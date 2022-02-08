<script>
export default {
  data() {
    return {
      tableData: [],
      size: 1,
      buyAmount: 1,
      packs: "",
      showEditInput: false,
      editId: 0,
      editAmount: 1,
      fields: ["id", "size", "actions"],
      isBusy: true,
    };
  },
  methods: {
    getData() {
      this.isBusy = true;
      this.$http
        .get("http://127.0.0.1:8084/api/getWidgetPackSizesData")
        .then((response) => {
          this.isBusy = false;
          this.tableData = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      // JSON responses are automatically parsed.
    },
    deleteData(deleteId) {
      this.$http
        .post(
          "http://127.0.0.1:8084/api/deleteWidgetPackSize",
          { id: deleteId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveSize() {
      this.$http
        .post(
          "http://127.0.0.1:8084/api/saveWidgetPackSize",
          { size: this.size },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.size = 1;
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    buyWidgets() {
      this.$http
        .get("http://127.0.0.1:8084/api/createWidgetOrder", {
          params: {
            amount: this.buyAmount,
          },
        })
        .then((response) => {
          for (let [k, v] of Object.entries(response.data.packs)) {
            this.packs += k + " x" + v + " | ";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showEditData(editId) {
      this.showEditInput = true;
      this.editId = editId;
    },
    editData() {
      this.$http
        .post(
          "http://127.0.0.1:8084/api/updateWidgetPackSize",
          { id: this.editId, size: this.editAmount },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.showEditInput = false;
          this.editId = 0;
          this.editAmount = 1;
          this.getData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
<template>
  <div style="margin-bottom: 20px; padding: 0 20px 0 20px; margin-top: 20px">
    <div style="margin-bottom: 10px">
      <b-table
        :busy="isBusy"
        :fields="fields"
        :items="tableData"
        responsive="md"
        bordered
        fixed
      >
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(actions)="data">
          <b-button
            variant="warning"
            @click="showEditData(data.id)"
            style="margin-right: 10px"
          >
            Edit
          </b-button>
          <b-button variant="danger" @click="deleteData(data.id)">
            Delete
          </b-button>
        </template>
      </b-table>
      <b-form-input
        style="width: 30%; margin-bottom: 5px"
        v-if="showEditInput"
        v-model="editAmount"
      ></b-form-input>
      <b-button variant="success" v-if="showEditInput" @click="editData()">
        Edit
      </b-button>
    </div>
    <h4>Create new pack size</h4>
    <b-form-input
      style="width: 30%; margin-bottom: 5px"
      v-model="size"
      type="number"
      oninput="if(this.value < 1) this.value = 1;"
    ></b-form-input>
    <b-button variant="success" @click="saveSize()">Create</b-button>
  </div>
  <div style="padding: 0 20px 0 20px">
    <b-form-input
      style="width: 30%; margin-bottom: 5px"
      v-model="buyAmount"
      type="number"
      oninput="if(this.value < 1) this.value = 1;"
    ></b-form-input>
    <b-button variant="success" @click="buyWidgets()">Buy Widgets</b-button>
    <div style="margin-top: 10px">Widgets Bought: {{ packs }}</div>
  </div>
</template>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
