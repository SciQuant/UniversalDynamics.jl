var documenterSearchIndex = {"docs":
[{"location":"dynamicalsystem.html#Introduction","page":"Dynamical system","title":"Introduction","text":"","category":"section"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"Supose we would like to build a System of SDEs that comes from the union of a given collection of AbstractDynamics, with either arbitrary (see SystemDynamics) or known (see ModelDynamics) coefficients. To be more precise, given a set of Dynamics for  x(t) y(t) z(t) :","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"beginaligned\ndvecx(t) = f_x(t vecx(t)) cdot dt + g_x(t vecx(t)) cdot dvecW_x(t) quad vecx(t_0) = vecx_0\ndvecy(t) = f_y(t vecy(t)) cdot dt + g_y(t vecy(t)) cdot dvecW_y(t) quad vecy(t_0) = vecy_0\ndvecz(t) = f_z(t vecz(t)) cdot dt + g_z(t vecz(t)) cdot dvecW_z(t) quad vecz(t_0) = vecz_0\nendaligned","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"we wish to obtain the resulting general Dynamics for u(t):","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"dvecu(t) = f(t vecu(t)) cdot dt + g(t vecu(t)) cdot dvecW(t) quad vecu(t_0) = vecu_0","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"with:","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"vecu(t) =\n    beginbmatrix\n        vecx(t) \n        vecy(t) \n        vecz(t)\n    endbmatrix\nquad\nf(t vecu(t)) =\n    beginbmatrix\n        f_x(t vecx(t)) \n        f_y(t vecy(t)) \n        f_z(t vecz(t))\n    endbmatrix\nquad\ng(t vecu(t)) =\n    beginbmatrix\n        g_x(t vecx(t))  0  0 \n        0  g_y(t vecy(t))  0 \n        0  0  g_z(t vecz(t))\n    endbmatrix\nquad\ndvecW(t) =\n    beginbmatrix\n        vecW_x(t) \n        vecW_y(t) \n        vecW_z(t)\n    endbmatrix","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"A DynamicalSystem provides a shorthand for constructing all the previous prototypes which are needed in the Stochastic Differential Equation solvers. However, it does not construct the general functions f and g. This task is left to the user. It does provide many useful handlers that come in handy when coding f and g.","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"DynamicalSystem","category":"page"},{"location":"dynamicalsystem.html#UniversalDynamics.DynamicalSystem","page":"Dynamical system","title":"UniversalDynamics.DynamicalSystem","text":"DynamicalSystem{IIP,D,M,DN,T} <: AbstractDynamics{IIP,D,M,DN,T}\n\nThe central structure of UniversalDynamics. Its main purpose is to construct an AbstractDynamics given a collection of AbstractDynamics.\n\nType parameters:\n\nSee AbstractDynamics for detailed information.\n\nFields:\n\nf: drift coefficient represented as either an in place or out of place function,\ng: diffusion coefficient represented as either an in place or out of place function,\nattributes:\nt0: initial time,\nx0: initial state,\nρ: correlation matrix, and\nnoise: Wiener process.\nparams: container with parameters values (preferably a NamedTuple),\ndynamics: collection of AbstractDynamics (preferably in a OrderedDict),\nsecurities: useful handlers for both dynamics simulation and derivatives pricing.\n\nDeclaration:\n\nGiven a collection of dynamics, group them together in a container such as an OrderedDict and define a DynamicalSystem using:\n\nDynamicalSystem(dynamics)\n\nThe resulting object will have information that can be inspected and is useful for coding the coefficients (drift and difussion) functions.\n\nThe complete declaration of a DynamicalSystem requires:\n\nDynamicalSystem(f, g, dynamics, params)\n\nwith f and g either the in place or the out of place functions for the coefficients:\n\nOut of place: coefficients must be in the form f(u, p, t) -> SVector and g(u, p, t) -> SVector for DiagonalNoise cases or g(u, p, t) -> SMatrix for NonDiagonalNoise cases. These functions return the drift or diffusion coefficients as SArrays given a current state u, current time t and a set of parameters.\nIn place: coefficients must be in the form f(du, u, p, t) -> nothing and g(du, u, p, t) -> nothing. These functions modify in place du::Array and set it equal to either the drift or the diffusion coefficients given a current state u, current time t and a set of parameters.\n\n\n\n\n\n","category":"type"},{"location":"dynamicalsystem.html#Simple-example","page":"Dynamical system","title":"Simple example","text":"","category":"section"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"using OrderedCollections # hide\nusing UniversalDynamics # hide\n# declare dynamics\nx = SystemDynamics(rand(1); noise=ScalarNoise())\ny = SystemDynamics(rand(2); noise=DiagonalNoise(2), ρ=[1 0.3; 0.3 1])\nz = SystemDynamics(rand(3); noise=NonDiagonalNoise(2), ρ=[1 0.2; 0.2 1])\n\n# group dynamics in a container\ndynamics = OrderedDict(:x => x, :y => y, :z => z)\n\n# compute dynamical system\nds = DynamicalSystem(dynamics)","category":"page"},{"location":"dynamicalsystem.html#Out-of-place-example","page":"Dynamical system","title":"Out of place example","text":"","category":"section"},{"location":"dynamicalsystem.html","page":"Dynamical system","title":"Dynamical system","text":"using OrderedCollections # hide\nusing UniversalDynamics # hide\nusing StaticArrays # hide\nusing UnPack # hide\n# load some parameters\ninclude(\"../../test/DaiSingletonParameters_A3_1.jl\")\n\n# define short rate model dynamics parameters\nx0 = @SVector [υ₀, θ₀, r₀]\n\nξ₀(t) = zero(t) # ξ₀ = zero\n\nξ₁(t) = @SVector [0, 0, 1]\n\nϰ(t) = @SMatrix([\n    μ     0 0\n    0     ν 0\n    κ_rυ -κ κ\n])\n\nθ(t) = @SVector [ῡ, θ̄, θ̄ ]\n\nΣ(t) = @SMatrix [\n    η           0    0\n    η * σ_θυ    1 σ_θr\n    η * σ_rυ σ_rθ    1\n]\n\nα(t) = @SVector [0, ζ^2, α_r]\n\nβ(t) = @SMatrix [\n    1   0 0\n    β_θ 0 0\n    1   0 0\n]\n\n# declare short rate model dynamics\nx = MultiFactorAffineModelDynamics(x0, ϰ, θ, Σ, α, β, ξ₀, ξ₁)\n\n# declare money market account dynamics\nB = SystemDynamics(one(eltype(x)))\n\n# out of place drift coefficient\nfunction f(u, p, t)\n    @unpack x_dynamics, x_security, B_security = p\n\n    x = remake(x_security, u)\n    B = remake(B_security, u)\n\n    IR = FixedIncomeSecurities(x_dynamics, x, B)\n\n    dx = drift(x(t), parameters(x_dynamics), t)\n    dB = IR.r(t) * B(t)\n\n    return vcat(dx, dB)\nend\n\n# out of place diffusion coefficient\nfunction g(u, p, t)\n    @unpack x_dynamics, x_security, B_security = p\n\n    x = remake(x_security, u)\n    B = remake(B_security, u)\n\n    dx = diffusion(x(t), parameters(x_dynamics), t)\n    dB = zero(eltype(u))\n\n    return @SMatrix [dx[1,1] dx[1,2] dx[1,3]  0\n                     dx[2,1] dx[2,2] dx[2,3]  0\n                     dx[3,1] dx[3,2] dx[3,3]  0\n                           0       0       0 dB]\nend\n\n# group dynamics in a container\ndynamics = OrderedDict(:x => x, :B => B)\n\n# compute dynamical system\nds = DynamicalSystem(f, g, dynamics, nothing)","category":"page"},{"location":"simulation.html#Simulation","page":"Simulation","title":"Simulation","text":"","category":"section"},{"location":"dynamics.html#Introduction","page":"Dynamics","title":"Introduction","text":"","category":"section"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"In UniversalDynamics a Dynamics represents continuous time, D-dimensional Ito Systems of Stochastic Differential Equations (SDEs):","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"dvecu(t) = f(t vecu(t)) cdot dt + g(t vecu(t)) cdot dvecW(t) quad vecu(t_0) = vecu_0","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"with drift coefficient f colon leftt_0 T right times mathbbR^D rightarrow mathbbR^D, diffusion coefficient g colon left t_0 T right times mathbbR^D rightarrow mathbbR^D times M, M-dimensional driving Wiener correlated or uncorrelated process dvecW(t) and initial condition vecu_0.","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"The main abstract type for these kind of objects is given by:","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"UniversalDynamics.AbstractDynamics","category":"page"},{"location":"dynamics.html#UniversalDynamics.AbstractDynamics","page":"Dynamics","title":"UniversalDynamics.AbstractDynamics","text":"abstract type AbstractDynamics{InPlace,Dim,NoiseDim,DiagNoise,elType} end\n\nSupertype for all kind of dynamics.\n\nType parameters:\n\nInPlace: states wether coefficients are in or out of place,\nDim: dynamics dimension,\nNoiseDim: noise dimension,\nDiagNoise: indicates if the noise is of DiagonalNoise or NonDiagonalNoise type,\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"It is worth mentioning that there exists simpler cases of Dynamics, which are fairly common, namely:","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"ScalarNoise\nDiagonalNoise\nNonDiagonalNoise","category":"page"},{"location":"dynamics.html#UniversalDynamics.ScalarNoise","page":"Dynamics","title":"UniversalDynamics.ScalarNoise","text":"ScalarNoise <: AbstractNoise{1}\n\nA D-dimensional system has ScalarNoise when there is only a unique noise process that affects all the Stochastic Differential Equations. In that sense, the system is given by:\n\ndu(t) = f(t u(t))  dt + g(t u(t))  dW(t) quad u(t₀) = u₀\n\nwith drift coefficient f colon left t₀ T right  mathbbRᴰ  mathbbRᴰ, diffusion coefficient g colon left t₀ T right  mathbbRᴰ  mathbbRᴰ, 1-dimensional driving Wiener process dW(t) and initial condition u₀.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#UniversalDynamics.DiagonalNoise","page":"Dynamics","title":"UniversalDynamics.DiagonalNoise","text":"DiagonalNoise{M} <: AbstractNoise{M}\n\nA D-dimensional system has DiagonalNoise when there are M = D noise processes that affect each Stochastic Differential Equation individually. In that sense, the system is given by:\n\ndu(t) = f(t u(t))  dt + g(t u(t))  dvecW(t) quad u(t₀) = u₀\n\nwith drift coefficient f colon left t₀ T right  mathbbRᴰ  mathbbRᴰ, diffusion coefficient g colon left t₀ T right  mathbbR^D  mathrmdiag colon mathbbR^D  D, D-dimensional driving Wiener correlated or uncorrelated process dvecW(t) and initial condition u₀.\n\nIn these kind of systems, the diagonal of g(t u(t)) is represented by a D-dimensional vector. Then, the product g(t u(t))  dvecW(t) is replaced by the broadcasted product .*.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#UniversalDynamics.NonDiagonalNoise","page":"Dynamics","title":"UniversalDynamics.NonDiagonalNoise","text":"NonDiagonalNoise{M} <: AbstractNoise{M}\n\nA D-dimensional system has NonDiagonalNoise when there are M noise processes that affect the Stochastic Differential Equations. In that sense, the system is given by:\n\ndu(t) = f(t u(t))  dt + g(t u(t))  dvecW(t) quad u(t₀) = u₀\n\nwith drift coefficient f colon left t₀ T right  mathbbRᴰ  mathbbRᴰ, diffusion coefficient g colon left t₀ T right  mathbbRᴰ  mathbbR^D  M, M-dimensional driving Wiener correlated or uncorrelated process dvecW(t) and initial condition u₀.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#Representation","page":"Dynamics","title":"Representation","text":"","category":"section"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"Dynamics are represented by two main types, SystemDynamics and ModelDynamics, described below.","category":"page"},{"location":"dynamics.html#SystemDynamics","page":"Dynamics","title":"SystemDynamics","text":"","category":"section"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"SystemDynamics","category":"page"},{"location":"dynamics.html#UniversalDynamics.SystemDynamics","page":"Dynamics","title":"UniversalDynamics.SystemDynamics","text":"SystemDynamics{IIP,D,M,DN,T} <: AbstractDynamics{IIP,D,M,DN,T}\n\nRepresents dynamics with arbitrary coefficients.\n\nType parameters:\n\nSee AbstractDynamics for detailed information.\n\nFields:\n\nt0: initial time,\nx0: initial state,\nρ: correlation matrix, and\nnoise: Wiener process.\n\nDeclaration\n\nSystemDynamics(x0::S;\n    t0=zero(eltype(S)), ρ::R=I, noise::AbstractNoise=DiagonalNoise{length(x0)}(),\n) -> SystemDynamics\n\nreturns a SystemDynamics with the given fields, such as state or initial condition x0, intial time t0, correlation matrix ρ and a driving Wiener process noise. Remaining type parameters are obtained through:\n\nIIP: true if isa(x0, Vector) or false if isa(x0, Union{Real,SVector}),\nD: equals to length(x0),\nM: determined by noise, default value is D,\nDN: determined by noise, default value is true.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#ModelDynamics","page":"Dynamics","title":"ModelDynamics","text":"","category":"section"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"UniversalDynamics.ModelDynamics","category":"page"},{"location":"dynamics.html#UniversalDynamics.ModelDynamics","page":"Dynamics","title":"UniversalDynamics.ModelDynamics","text":"abstract type ModelDynamics{IIP,D,M,DN,T} <: AbstractDynamics{IIP,D,M,DN,T} end\n\nSupertype for all dynamics with known coefficients.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"ModelDynamics subtypes include many common financial models dynamics. Even though they could always be declared as regular SystemDynamics, it is somewhat useful to have them coded in the library. This enables traceable, reproducible and fast code. Also, for some models, there are many other features implemented in the library, such as Interest Rate Modeling features.","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"The following is a list with implemented model dynamics:","category":"page"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"UniversalDynamics.EquityModelDynamics\nUniversalDynamics.InterestRateModelDynamics\nUniversalDynamics.VolatilityModelDynamics","category":"page"},{"location":"dynamics.html#UniversalDynamics.EquityModelDynamics","page":"Dynamics","title":"UniversalDynamics.EquityModelDynamics","text":"abstract type EquityModelDynamics{IIP,D,M,DN,T} <: ModelDynamics{IIP,D,M,DN,T} end\n\nSupertype for all Equity Models dynamics, such as:\n\nBlackScholesMertonModelDynamics,\n\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#UniversalDynamics.InterestRateModelDynamics","page":"Dynamics","title":"UniversalDynamics.InterestRateModelDynamics","text":"abstract type InterestRateModelDynamics{IIP,D,M,DN,T} <: ModelDynamics{IIP,D,M,DN,T} end\n\nSupertype for all Interest Rate Models dynamics, such as:\n\nShortRateModelDynamics,\nLiborMarketModelDynamics,\nForwardMarketModelDynamics,\nHeathJarrowMortonModelDynamics.\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html#UniversalDynamics.VolatilityModelDynamics","page":"Dynamics","title":"UniversalDynamics.VolatilityModelDynamics","text":"abstract type VolatilityModelDynamics{IIP,D,M,DN,T} <: ModelDynamics{IIP,D,M,DN,T} end\n\nSupertype for all Volatility Models dynamics, such as:\n\nLocalVolatilityModelDynamics,\nStochasticVolatilityModelDynamics,\n\n\n\n\n\n","category":"type"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"See each corresponding model dynamics section for detailed information.","category":"page"},{"location":"dynamics.html#Examples","page":"Dynamics","title":"Examples","text":"","category":"section"},{"location":"dynamics.html","page":"Dynamics","title":"Dynamics","text":"using UniversalDynamics # hide\nusing StaticArrays # hide\nDₓ = 3\nMₓ = 5\nx0 = @SVector ones(Dₓ)\nx = SystemDynamics(x0; noise=NonDiagonalNoise(Mₓ))","category":"page"},{"location":"index.html#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"UniversalDynamics is a high-performance library designed to achieve fast and advanced quantitative finance calculations. It is being developed by SciQuant, an organization dedicated to creating high-quality scientific software for the financial industry.","category":"page"},{"location":"index.html#Getting-Started","page":"Introduction","title":"Getting Started","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The package can be installed using the Julia package manager. From the Julia REPL, type ] to enter the Pkg REPL mode and run:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"pkg> add https://github.com/SciQuant/UniversalDynamics.jl.git","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"Or, equivalently, via the Pkg API:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"julia> import Pkg; Pkg.add(PackageSpec(url = \"https://github.com/SciQuant/UniversalDynamics.jl.git\"))","category":"page"}]
}