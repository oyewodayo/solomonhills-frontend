
    let compound_frequency = document.querySelector("#compound_frequency");
    let duration = document.querySelector("#duration");
    let currentAge = document.querySelector("#current_age");
    let retirementAge = document.querySelector("#retirement_age");
    let startingBalance = document.querySelector("#starting_balance");
    let contributionAmount = document.querySelector("#contribution_amount");
    let rateOfReturn = document.querySelector("#rate_of_return");
    let submitBtn = document.querySelector("#calculate_button");
    const myForm   = document.getElementById("my-form");

    let currentBalance = document.querySelector("#initial_balance");
    let sumContribution = document.querySelector("#sum_contributions");
    let growth = document.querySelector("#growth");
    let total_savings = document.querySelector("#total_savings");
    let savings_plan = document.querySelector("#savings_plan");
    let timestamp = document.querySelector("#timestamp");
    let initial_balance_percent = document.querySelector("#initial_balance_percent");
    let contribution_percent = document.querySelector("#contribution_percent");
    let growth_percent = document.querySelector("#growth_percent");
    let build_plan = document.querySelector("#build-plan");
    let results = document.querySelector("#results");
    let interest_table = document.querySelector("#interest-table");
    let input = document.querySelector("input");

 
    function formatMoney(value) {
      return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function compoundInterest() {
      let duration_time = duration.value?duration.value:1;
      let frequency = compound_frequency==null?365:compound_frequency.value;
      let initialBalance = currentBalance?currentBalance:200000;
      var a = ((startingBalance.value*Math.pow((1+(rateOfReturn.value/100/frequency)),(frequency*duration_time)))+((contributionAmount.value*((Math.pow((1+rateOfReturn.value/100/frequency),(frequency*duration_time))-1)/(rateOfReturn.value/100/12))))).toFixed(2)
      var contributions = contributionAmount.value?(parseFloat(contributionAmount.value)*parseFloat(duration_time)*12):0;
      var growth_yield = (parseFloat(a) - (parseFloat(startingBalance.value)+parseFloat(contributions)));
      console.log(a)
      timestamp.innerHTML = duration.value?duration.value:1;
      build_plan.classList.remove('d-none');
      build_plan.classList.add('d-block');
      // interest_table.classList.remove('d-none');
      total_savings.innerHTML = formatMoney(parseFloat(a));
      savings_plan.innerHTML = '₦'+formatMoney(parseFloat(a));
      initialBalance.innerHTML = isNaN(parseFloat(startingBalance.value))?'0.00': formatMoney(parseFloat(startingBalance.value));
      sumContribution.innerHTML = isNaN(parseFloat(contributions))?'0.00':formatMoney(contributions);
      growth.innerHTML = isNaN(parseFloat(growth_yield))?'0.00':formatMoney(growth_yield);
      initial_balance_percent.innerHTML = isNaN(parseFloat(startingBalance.value))?'0.00':formatMoney((parseFloat(startingBalance.value)/parseFloat(a))*100);
      contribution_percent.innerHTML = isNaN(parseFloat(contributions))?'0.00':formatMoney((parseFloat(contributions)/parseFloat(a))*100);
      growth_percent.innerHTML = isNaN(parseFloat(growth_yield))?'0.00':formatMoney(((parseFloat(growth_yield)/parseFloat(a))*100));
      
      var rowcount = Number(duration_time);
      var monthlyContribution = parseInt(sumContribution.value);
      var annualInterestRate = parseInt(rateOfReturn.value) / 100.0;
      var interestFactor = 1 + annualInterestRate / 12.0;
      var balance = 0;
      var totalDeposit = 0;
      var monthCount = 0;
      var yearInterest = 0;
      var perviousYearInterest = 0;
      
      for (let year = 0; year <= rowcount; ++year) {
          // const element = array[year];
          monthCount = 12 * year;
          totalDeposit = 12.0 * contributionAmount.value * year;
          balance = contributionAmount.value * (
            (Math.pow(interestFactor, monthCount + 1) - 1) /
            (interestFactor - 1) - 1);
          perviousYearInterest = yearInterest;
          yearInterest = balance - totalDeposit;

          results.innerHTML =`<tr>
                              <td>${+year}</td>
                              <td>${formatMoney(totalDeposit)}</td>
                              <td>${formatMoney(yearInterest-perviousYearInterest)}</td>
                              <td>${formatMoney(totalDeposit)}</td>
                              <td>${formatMoney(balance - totalDeposit)}</td>
                              <td>${formatMoney(balance)}</td>
                              </tr>`;
      }

    }
    compoundInterest();


