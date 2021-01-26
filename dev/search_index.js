var documenterSearchIndex = {"docs":
[{"location":"dynamicalsystem.html#Dynamical-System","page":"Dynamical systems","title":"Dynamical System","text":"","category":"section"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"In UniversalDynamics a Dynamical System or, more precisely, a Stochastic Dynamical System represents a continuous time, D-dimensional Ito System of Stochastic Differential Equations:","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"beginaligned\n    dvecu(t)  = f(t vecu(t)) cdot dt + g(t vecu(t)) cdot dvecW(t)\n    vecu(t_0) = vecu_0\nendaligned","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"where f colon leftt_0 T right times mathbbR^D rightarrow mathbbR^D represents the drift, g colon left t_0 T right times mathbbR^D rightarrow mathbbR^D times M the diffusion and dvecW(t) an M-dimensional driving Wiener process.","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"In the context of quantitative finance we might want to solve a DynamicalSystem formed by a set of sub-dynamics, such as:","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"SystemDynamics representing arbitrary dynamics;\nModelDynamics representing known models dynamics, such as:\nBlackScholesMerton,\nShortRateModelDynamics,\nLiborMarketModelDynamics,\nHeathJarrowMortonFrameworkDynamics,\nHestonModelDynamics,\n...","category":"page"},{"location":"dynamicalsystem.html#Example","page":"Dynamical systems","title":"Example","text":"","category":"section"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"Supose we want to price a european option on a stock S with stochastic interest rates (sacar del cap 1 del Andersen). In this context we need to simulate, for example, a short rate described by any ShortRateModelDynamics and a stock price given by a SystemDynamics.","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"# define dynamics\nx = MultiFactorAffineModelDynamics(x0, ϰ, θ, Σ, α, β, ξ₀, ξ₁)\nS = SystemDynamics(S0; noise=NonDiagonalNoise(Mₛ))\n\n# container\ndynamics = OrderedDict(:x => x, :S => S)\n\n# define dynamical system formed by the given dynamics\ndynamical_system = DynamicalSystem(dynamics)","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"This will allow the user to check important attributes...","category":"page"},{"location":"dynamicalsystem.html","page":"Dynamical systems","title":"Dynamical systems","text":"However, in order to solve a DynamicalSystem, the drift f and the diffusion g functions must be provided.","category":"page"},{"location":"index.html#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"UniversalDynamics is a high-performance library designed to achieve fast and advanced quantitative finance calculations. It is being developed by SciQuant, an organization dedicated to creating high-quality scientific software for the financial industry.","category":"page"},{"location":"index.html#Getting-Started","page":"Introduction","title":"Getting Started","text":"","category":"section"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"The package can be installed using the Julia package manager. From the Julia REPL, type ] to enter the Pkg REPL mode and run:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"pkg> add https://github.com/SciQuant/UniversalDynamics.jl.git","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"Or, equivalently, via the Pkg API:","category":"page"},{"location":"index.html","page":"Introduction","title":"Introduction","text":"julia> import Pkg; Pkg.add(PackageSpec(url = \"https://github.com/SciQuant/UniversalDynamics.jl.git\"))","category":"page"}]
}
