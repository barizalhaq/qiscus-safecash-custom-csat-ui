<template>
  <div class="flex h-screen">
    <div class="m-auto flex justify-center items-center">
      <div class="flex h-screen">
        <!-- bg-safecash bg-no-repeat bg-center bg-contain bg-fixed -->
        <div class="relative m-auto flex flex-col z-0 h-screen items-center">
          <img
            src="/background v2.jpeg"
            alt=""
            class="object-contain h-screen"
          />
          <div class="flex flex-col m-auto absolute justify-center h-full">
            <div
              v-if="!loading && !surveyDone"
              class="h-4/5 grid grid-flow-row auto-rows-max gap-4 justify-center p-8 overflow-y-auto"
            >
              <div
                class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
                v-if="errMessage !== undefined"
              >
                <p class="font-bold">Gagal!</p>
                <p class="break-words">{{ errMessage }}</p>
              </div>
              <div>
                <h1 class="font-bold">
                  <span class="text-base">Hai </span
                  ><span class="text-base text-main-blue">SafeFriends </span
                  ><span>!</span>
                </h1>
              </div>
              <div>
                <span class="font-bold text-base break-words">
                  Bagaimana layanan Customer Care Safecash?</span
                >
              </div>
              <div class="flex flex-row justify-evenly">
                <button
                  @click="
                    () => {
                      survey.puas = true
                      survey.tidakPuas = false
                    }
                  "
                  v-bind:class="{
                    'bg-green-700 border-green-700 text-white': survey.puas,
                    'text-green-500 border-transparent': !survey.puas,
                  }"
                  class="inline-flex flex-col space-y-2 justify-center items-center rounded-md border-4 font-bold px-4 py-2 focus:outline-none"
                >
                  <img
                    src="/excellent_emot.png"
                    alt="excellent_emot"
                    class="w-10"
                  />
                  <span class="text-base">Puas</span>
                </button>
                <button
                  @click="
                    () => {
                      survey.puas = false
                      survey.tidakPuas = true
                    }
                  "
                  v-bind:class="{
                    'bg-red-700 border-red-700 text-white': survey.tidakPuas,
                    'text-red-500 border-transparent': !survey.tidakPuas,
                  }"
                  class="inline-flex flex-col space-y-2 justify-center items-center rounded-md border-4 font-bold px-4 py-2 focus:outline-none"
                >
                  <img src="/bad_emot.png" alt="bad_emot" class="w-10" />
                  <span class="text-base">Tidak Puas</span>
                </button>
              </div>
              <div class="flex flex-col space-y-2 mb-3">
                <span class="font-bold text-base break-words mb-3"
                  >Bantu kami untuk terus dapat memberikan layanan terbaik untuk
                  Anda.</span
                >
                <span class="text-sm"
                  >Anda dapat memberikan penilaian terkait layanan yang
                  diberikan dengan menuliskan angka sesuai dengan masukan
                  dibawah ini.</span
                >
                <span class="text-sm text-red-500"
                  >* Boleh lebih dari satu</span
                >
                <ol class="list-decimal list-inside text-sm">
                  <li>Masalah Anda tidak teratasi</li>
                  <li>Penyelesaian masalah lama</li>
                  <li>Customer Care tidak memahami masalah Anda</li>
                  <li>Prosedur terlalu rumit</li>
                  <li>Kesopanan dan keramahan Customer Care</li>
                  <li>Kecepatan response Customer Care</li>
                  <li>Lainya. Jelaskan</li>
                </ol>
              </div>
              <div class="w-full">
                <textarea
                  placeholder="Masukkan jawaban Anda"
                  class="border-none rounded-md ring ring-gray-300 focus:outline-none p-4 w-full"
                  v-model="survey.feedback"
                ></textarea>
              </div>
              <div class="flex justify-center pb-8 md:pb-0">
                <button
                  @click="submitSurvey"
                  class="rounded-md font-bold text-white border-2 border-main-blue bg-main-blue px-4 py-2 focus:outline-none"
                >
                  SELESAI
                </button>
              </div>
            </div>
            <div
              v-else
              class="h-full grid grid-flow-row auto-rows-max gap-4 place-content-center px-8"
            >
              <div v-if="loading">
                <div class="flex flex-col space-y-4 m-auto items-center">
                  <Spinner class="w-24 text-main-blue font-bold text-center" />
                  <span class="font-bold text-sm text-main-blue italic">
                    wait a sec.....
                  </span>
                </div>
              </div>
              <Closing
                class="items-center m-auto space-y-6"
                v-if="surveyDone"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData(context) {
    try {
      const csatResponse = await context.$axios.post(
        `/api/v1/csat/${context.params.csat_code}/check`
      )

      const csat = csatResponse.data.data.csat
      const config = csatResponse.data.data.config

      return { csat, config, surveyDone: csat.submitted_at !== null }
    } catch (err) {
      if (
        Object.prototype.hasOwnProperty.call(err, 'response') &&
        err.response.status === 400
      ) {
        context.error({ statusCode: err.response.status, message: 'Not Found' })
      }
    }
  },
  data() {
    return {
      survey: {
        puas: false,
        tidakPuas: false,
        feedback: '',
      },
      surveyDone: false,
      loading: false,
      errMessage: undefined,
    }
  },
  methods: {
    async submitSurvey() {
      this.loading = true
      const data = {
        feedback: this.survey.feedback,
        rating: '',
      }

      if (this.survey.puas) {
        data.rating = 'Puas'
      } else if (this.survey.tidakPuas) {
        data.rating = 'Tidak Puas'
      }

      try {
        await this.$axios.post(
          `/api/v1/csat/${this.csat.csat_code}/create`,
          data
        )

        this.surveyDone = true
      } catch (err) {
        if (
          Object.prototype.hasOwnProperty.call(err, 'response') &&
          err.response.status === 422
        ) {
          this.errMessage = err.response.data.message
        }
        this.surveyDone = false
      }

      this.loading = false
    },
  },
}
</script>
