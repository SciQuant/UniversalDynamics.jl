## Introduction

Supose we need to build a System of SDEs that comes from the union of a given collection of [`AbstractDynamics`](@ref), with either arbitrary (see [`SystemDynamics`](@ref)) or known (see [`ModelDynamics`](@ref)) coefficients. To be more precise, given a set of ``N`` *Dynamics* for ``\{ \vec{x}_1(t), \vec{x}_2(t), \dots, \vec{x}_N(t) \}``:

```math
\begin{aligned}
d\vec{x}_1(t) &= f_{1}(t, \vec{x}_1(t)) \cdot dt + g_{1}(t, \vec{x}_1(t)) \cdot d\vec{W}_{1}(t), \quad \vec{x}_1(t_0) = \vec{x}_1^0,\\
d\vec{x}_2(t) &= f_{2}(t, \vec{x}_2(t)) \cdot dt + g_{2}(t, \vec{x}_2(t)) \cdot d\vec{W}_{2}(t), \quad \vec{x}_2(t_0) = \vec{x}_2^0,\\
\vdots & \\
d\vec{x}_N(t) &= f_{N}(t, \vec{x}_N(t)) \cdot dt + g_{N}(t, \vec{x}_N(t)) \cdot d\vec{W}_{N}(t), \quad \vec{x}_N(t_0) = \vec{x}_N^0,\\
\end{aligned}
```

 we wish to obtain the resulting general *Dynamics* for ``u(t)``:

 ```math
d\vec{u}(t) = f(t, \vec{u}(t)) \cdot dt + g(t, \vec{u}(t)) \cdot d\vec{W}(t), \quad \vec{u}(t_0) = \vec{u}_0,\\
```

with:

```math
\vec{u}(t) =
    \begin{bmatrix}
        \vec{x}_1(t) \\
        \vec{x}_2(t) \\
        \vdots       \\
        \vec{x}_N(t)
    \end{bmatrix}
\quad
f(t, \vec{u}(t)) =
    \begin{bmatrix}
        f_{1}(t, \vec{x}_1(t)) \\
        f_{2}(t, \vec{x}_2(t)) \\
        \vdots                   \\
        f_{N}(t, \vec{x}_N(t))
    \end{bmatrix}
\quad
g(t, \vec{u}(t)) =
    \begin{bmatrix}
        g_{1}(t, \vec{x}_2(t)) & 0 & \dots & 0 \\
        0 & g_{2}(t, \vec{x}_1(t)) & \dots & 0 \\
        \vdots & \vdots & \ddots & \vdots \\
        0 & 0 & \dots & g_{N}(t, \vec{x}_N(t))
    \end{bmatrix}
\quad
\vec{W}(t) =
    \begin{bmatrix}
        \vec{W}_{1}(t) \\
        \vec{W}_{2}(t) \\
        \vdots           \\
        \vec{W}_{N}(t)
    \end{bmatrix}
```

A [`DynamicalSystem`](@ref) provides a shorthand for constructing all the previous prototypes which are needed in the Stochastic Differential Equation solvers. However, it does not construct the general functions ``f`` and ``g``. This task is left to the user. It does provide many useful handlers that come in handy when coding ``f`` and ``g``.

```@docs
DynamicalSystem
```

## Basic example

```@example
using OrderedCollections # hide
using UniversalDynamics # hide
# declare dynamics
x = SystemDynamics(rand(1); noise=ScalarNoise())
y = SystemDynamics(rand(2); noise=DiagonalNoise(2), ρ=[1 0.3; 0.3 1])
z = SystemDynamics(rand(3); noise=NonDiagonalNoise(2), ρ=[1 0.2; 0.2 1])

# group dynamics in a container
dynamics = OrderedDict(:x => x, :y => y, :z => z)

# compute dynamical system
ds = DynamicalSystem(dynamics)
```

## Out of place example

A [`MultiFactorAffineModelDynamics`](@ref) with its money market account. Checkout [Multi-Factor Affine Model](@ref) for detailed information about this kind of Short Rate Model.

```@example
using OrderedCollections # hide
using UniversalDynamics # hide
using StaticArrays # hide
using UnPack # hide
# load some parameters
include("../../../test/DaiSingletonParameters_A3_1.jl")

# define short rate model dynamics parameters
x0 = @SVector [υ₀, θ₀, r₀]

ξ₀(t) = zero(t) # ξ₀ = zero

ξ₁(t) = @SVector [0, 0, 1]

ϰ(t) = @SMatrix([
    μ     0 0
    0     ν 0
    κ_rυ -κ κ
])

θ(t) = @SVector [ῡ, θ̄, θ̄ ]

Σ(t) = @SMatrix [
    η           0    0
    η * σ_θυ    1 σ_θr
    η * σ_rυ σ_rθ    1
]

α(t) = @SVector [0, ζ^2, α_r]

β(t) = @SMatrix [
    1   0 0
    β_θ 0 0
    1   0 0
]

# declare short rate model dynamics
x = MultiFactorAffineModelDynamics(x0, ϰ, θ, Σ, α, β, ξ₀, ξ₁; noise=NonDiagonalNoise(3))

# declare money market account dynamics
B = SystemDynamics(one(eltype(x)))

# out of place drift coefficient
function f(u, p, t)
    @unpack x_dynamics, x_security, B_security = p

    x = remake(x_security, u)
    B = remake(B_security, u)

    IR = FixedIncomeSecurities(x_dynamics, x, B)

    dx = drift(x(t), parameters(x_dynamics), t)
    dB = IR.r(t) * B(t)

    return vcat(dx, dB)
end

# out of place diffusion coefficient
function g(u, p, t)
    @unpack x_dynamics, x_security, B_security = p

    x = remake(x_security, u)
    B = remake(B_security, u)

    dx = diffusion(x(t), parameters(x_dynamics), t)
    dB = zero(eltype(u))

    return @SMatrix [dx[1,1] dx[1,2] dx[1,3]  0
                     dx[2,1] dx[2,2] dx[2,3]  0
                     dx[3,1] dx[3,2] dx[3,3]  0
                           0       0       0 dB]
end

# group dynamics in a container
dynamics = OrderedDict(:x => x, :B => B)

# compute dynamical system
ds = DynamicalSystem(f, g, dynamics, nothing)
```

## In place example

```@example
using OrderedCollections # hide
using UniversalDynamics # hide
using StaticArrays # hide
using UnPack # hide
# load some parameters
include("../../../test/DaiSingletonParameters_A3_1.jl")

# define short rate model dynamics parameters
x0 = [υ₀, θ₀, r₀]

ξ₀!(t) = zero(t) # ξ₀ = zero

function ξ₁!(u, t)
    u[1] = 0
    u[2] = 0
    u[3] = 1
    return nothing
end

function ϰ!(u, t)
    u[1,1] = μ
    u[2,2] = ν
    u[3,1] = κ_rυ
    u[3,2] = -κ
    u[3,3] = κ
    return nothing
end

function θ!(u, t)
    u[1] = ῡ
    u[2] = θ̄
    u[3] = θ̄
    return nothing
end

function Σ!(u, t)
    u[1,1] = η
    u[2,1] = η * σ_θυ
    u[2,2] = 1
    u[2,3] = σ_θr
    u[3,1] = η * σ_rυ
    u[3,2] = σ_rθ
    u[3,3] = 1
    return nothing
end

function α!(u, t)
    u[1] = 0
    u[2] = ζ^2
    u[3] = α_r
    return nothing
end

function β!(u, t)
    u[1,1] = 1
    u[2,1] = β_θ
    u[3,1] = 1
    return nothing
end

# declare short rate model dynamics
x = MultiFactorAffineModelDynamics(x0, ϰ!, θ!, Σ!, α!, β!, ξ₀!, ξ₁!; noise=NonDiagonalNoise(3))

# declare money market account dynamics
B = SystemDynamics(ones(eltype(x), 1)) # force `IIP = true` with `x0` as `Array`

# in place drift coefficient
function f(du, u, p, t)
    @unpack x_dynamics, x_security, B_security = p

    x = remake(x_security, u, du)
    B = remake(B_security, u, du)

    IR = FixedIncomeSecurities(x_dynamics, x, B)

    drift!(x.dx, x(t), parameters(x_dynamics), t)
    B.dx[] = IR.r(t) * B(t)

    return nothing
end

# in place diffusion coefficient
function g(du, u, p, t)
    @unpack x_dynamics, x_security, B_security = p

    x = remake(x_security, u, du)
    B = remake(B_security, u, du)

    diffusion!(x.dx, x(t), parameters(x_dynamics), t)
    B.dx[] = zero(eltype(u))

    return nothing
end

# group dynamics in a container
dynamics = OrderedDict(:x => x, :B => B)

# compute dynamical system
ds = DynamicalSystem(f, g, dynamics, nothing)
```