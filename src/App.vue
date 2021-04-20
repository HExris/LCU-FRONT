<template>
  <div id="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-autocomplete
          class="inline-input"
          v-model="queryChampionStr"
          :fetch-suggestions="querySearch"
          placeholder="请选择英雄"
          @select="handleSelect"
        ></el-autocomplete>
      </div>
      <div class="dashborad">
        <img
          v-if="selectedChampion"
          :src="require(`@/assets/champion/${selectedChampion.image.full}`)"
          alt=""
        />
        <div class="system-info">
          <div class="info-item" v-if="selectedChampion">
            <span class="info-label"> Champion ID: </span>
            <span>{{ selectedChampion.key }}</span>
          </div>
          <div class="info-item" v-if="port">
            <span class="info-label"> Username: </span>
            <span>riot</span>
          </div>
          <div class="info-item" v-if="port">
            <span class="info-label"> Port: </span>
            <span>{{ port }}</span>
          </div>
          <div class="info-item" v-if="token">
            <span class="info-label"> Token: </span>
            <span>{{ token }}</span>
          </div>
        </div>
      </div>
      <div class="champion-wrapper">
        <div
          class="champion"
          v-for="item in champions"
          :key="item.key"
          @click="handleSelect(item)"
        >
          <img
            :src="require(`@/assets/champion/${item.image.full}`)"
            :alt="item.name"
          />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      queryChampionStr: "",
      champions: [],
      selectedChampion: null,
      backEndWebsite: "",
      token: "",
      port: "",
    };
  },
  mounted() {
    this.initChampionsList();
  },
  methods: {
    initChampionsList() {
      fetch("/champions")
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.data instanceof Array) {
            this.champions = result.data;
          }
        });
    },
    querySearch(queryString, cb) {
      var champions = this.champions;
      var results = queryString
        ? champions.filter(this.createFilter(queryString))
        : champions;
      // 调用 callback 返回建议列表的数据
      results = results.map((v) => {
        return {
          ...v,
          value: `${v.name} ${v.title}`,
        };
      });
      cb(results);
    },
    createFilter(queryString) {
      return (champion) => {
        return (
          champion.id.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
          champion.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
          champion.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    handleSelect(item) {
      this.selectedChampion = item || null;
      this.getEnvConfig();
    },
    getEnvConfig() {
      fetch("/config")
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.data) {
            let { port, token } = result.data;
            this.port = port;
            this.token = token;
            this.backEndWebsite = `https://127.0.0.1:${port}`;
            this.$alert(
              "是否前往后台？",
              `${this.selectedChampion.name} ${this.selectedChampion.title}`,
              {
                confirmButtonText: "确定",
                showCancelButton: true,
              }
            ).then((action) => {
              if (action === "confirm") {
                window.open(this.backEndWebsite);
              }
            });
          } else {
            this.token = null;
            this.backEndWebsite = null;
          }
        });
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1b1b1b !important;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 10vh;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 510px;
  margin: auto;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgb(255 255 255 / 30%) !important;
}

.dashborad {
  display: flex;
  align-items: center;
}

.dashborad img {
  margin-right: 20px;
}
.system-info {
  flex: 1;
}

.info-item {
  line-height: 34px;
}

.info-label {
  width: 100px;
  display: inline-block;
  margin-right: 10px;
}

.champion-wrapper {
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  height: 600px;
  overflow-y: scroll;
  background-color: #eee;
  border-radius: 8px;
}

.champion-wrapper .champion img {
  width: 100px;
}
.champion-wrapper .champion .name {
  text-align: center;
}
.champion-wrapper .champion {
  cursor: pointer;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

::-webkit-scrollbar {
  width: 9px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 10%);
  background-color: #555;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 5%);
  border-radius: 8px;
  background-color: #f5f5f5;
}

.el-autocomplete {
  width: 100%;
}
</style>
